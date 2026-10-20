import { expect, test } from "@playwright/test";

const sharedPath = "/project/distributor-management-system";
test.use({ viewport: { width: 390, height: 844 } });

test("internal routes reject anonymous and forged sessions without leaking portfolio data", async ({ page, context }) => {
  const response = await page.goto("/project");
  await expect(page.getByRole("heading", { name: "Staff workspace" })).toBeVisible();
  const html = await response!.text();
  expect(html).not.toContain("Reserve a backend pairing session");
  expect(html).not.toContain("Bakso Denny");
  await page.goto("/projects");
  await expect(page).toHaveURL(/\/project$/);
  await context.addCookies([{ name: "project_admin_session", value: "forged", domain: "127.0.0.1", path: "/project" }]);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Staff workspace" })).toBeVisible();
  for (const path of ["/project/manage", "/project/manage/distributor-management-system"]) {
    const manager = await page.goto(path);
    await expect(page.getByRole("heading", { name: "Staff workspace" })).toBeVisible();
    expect(await manager!.text()).not.toContain("Reserve a backend pairing session");
    await expect(page.getByRole("button", { name: "Save changes" })).toHaveCount(0);
  }
});

test("client can follow the project process and read its activity history", async ({ page }) => {
  const response = await page.goto(sharedPath);
  const html = await response!.text();
  expect(html).not.toContain("internalNotes");
  expect(html).not.toContain("Reserve a backend pairing session");
  expect(html).not.toContain("Bakso Denny");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Distributor management system");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.getByRole("progressbar", { name: "Overall development progress" })).toHaveAttribute("aria-valuenow", "68");
  await expect(page.getByRole("heading", { name: "Development", exact: true })).toBeVisible();
  await expect(page.locator(".process-dates")).toContainText("30 Oct");
  await expect(page.locator(".process-dates")).toContainText("20 Nov");
  await expect(page.locator(".process-milestone")).toHaveCount(6);
  await expect(page.locator(".milestone-current .process-milestone-range")).toHaveText("28 Sept – 30 Oct");
  const calendar = page.getByRole("group", { name: "Project calendar", exact: true });
  await calendar.getByRole("button", { name: /22 Oct 2026:.*Approval rules review/ }).click();
  await expect(calendar.locator(".project-calendar-agenda")).toContainText("Sales and finance leads");
  await calendar.getByRole("button", { name: "Next month" }).click();
  await expect(calendar.locator(".project-calendar-heading")).toContainText("November 2026");
  await calendar.getByRole("button", { name: /4 Nov 2026:.*Client testing briefing/ }).click();
  await expect(calendar.locator(".project-calendar-agenda")).toContainText("testing scenarios");
  await calendar.getByRole("button", { name: "Previous month" }).click();
  await expect(calendar.locator(".project-calendar-heading")).toContainText("October 2026");
  await calendar.getByRole("button", { name: /19 Oct 2026:.*Development progress review/ }).click();
  await expect(calendar.locator(".project-calendar-agenda")).toContainText("Meeting");
  await expect(calendar.locator(".project-calendar-agenda")).toContainText("Development progress review");
  await expect(calendar.locator(".project-calendar-agenda")).toContainText("Development");
  await expect(calendar.locator(".project-calendar-agenda")).toContainText("Online · Client leads and ACTIVID");
  await calendar.getByRole("button", { name: /16 Oct 2026:.*Warehouse workflow visit/ }).click();
  await expect(calendar.locator(".project-calendar-agenda")).toContainText("Visit");
  await calendar.getByRole("button", { name: /14 Oct 2026:.*Order-approval flow revised/ }).click();
  await expect(calendar.locator(".project-calendar-agenda")).toContainText("Change");
  await expect(page.getByRole("heading", { name: "Orders are connecting to stock." })).toBeVisible();

  await expect(page.getByRole("heading", { name: "Next step", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Review decision" })).toHaveCount(0);
  const dates = page.getByRole("region", { name: "Important dates" });
  await expect(dates.locator("li")).toHaveCount(3);
  await expect(dates.locator("time")).toHaveText(["22 Oct 2026", "4 Nov 2026", "18 Nov 2026"]);
  const history = page.getByRole("region", { name: "Activity history" });
  await expect(history.locator("li")).toHaveCount(3);
  await expect(history.locator(".process-history-type")).toHaveText(["Meeting", "Visit", "Change"]);
  await expect(history.getByRole("heading", { name: "Development progress review" })).toBeVisible();
  await expect(history.getByRole("heading", { name: "Warehouse workflow visit" })).toBeVisible();
  await expect(history.getByRole("heading", { name: "Order-approval flow revised" })).toBeVisible();
  await expect(history.locator("time")).toHaveText(["19 Oct 2026", "16 Oct 2026", "14 Oct 2026"]);
  await expect(history).toContainText("Manado warehouse · Operations and ACTIVID");
  await page.locator("summary").filter({ hasText: "User testing" }).click();
  await expect(page.getByText(/Your sales, warehouse, and finance representatives/)).toBeVisible();
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
});

test("shared pages stay mobile-first, readable with reduced motion, and reject unknown slugs", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(sharedPath);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const lines = await page.locator("h1").evaluate((heading) => Math.round(heading.getBoundingClientRect().height / parseFloat(getComputedStyle(heading).lineHeight)));
    expect(lines).toBeLessThanOrEqual(2);
    await page.locator(".process-contact").scrollIntoViewIfNeeded();
    await expect(page.locator(".process-contact")).toHaveText("Project lead · Reza");
  }
  expect(errors).toEqual([]);
  const missing = await page.goto("/project/not-a-shared-project");
  expect(missing?.status()).toBe(404);
});

test("staff can sign in, open the isolated client view, and sign out", async ({ page }) => {
  test.skip(!process.env.PROJECTS_E2E_PASSWORD, "Requires a test server with isolated staff credentials.");
  await page.goto("/project");
  await page.getByLabel("Admin password").fill("incorrect");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.locator(".login-error")).toHaveText("Incorrect password.");
  await page.getByLabel("Admin password").fill(process.env.PROJECTS_E2E_PASSWORD!);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(5);
  await page.getByRole("button", { name: "Distributor management system", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Internal team note" })).toBeVisible();
  await page.getByRole("link", { name: "Open client view" }).click();
  await expect(page).toHaveURL(new RegExp(sharedPath + "$"));
  await expect(page.getByRole("heading", { name: "Internal team note" })).toHaveCount(0);
  await page.goto("/project");
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page.getByRole("heading", { name: "Staff workspace" })).toBeVisible();
});

test("staff can create a project, maintain its history, and publish changes to the client tracker", async ({ page, context }) => {
  test.skip(!process.env.PROJECTS_E2E_PASSWORD, "Requires isolated staff credentials and project storage.");
  const slug = `distribution-rollout-${Date.now()}`;
  await page.goto("/project");
  await page.getByLabel("Admin password").fill(process.env.PROJECTS_E2E_PASSWORD!);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("button", { name: "Sign out", exact: true })).toBeVisible();
  await page.goto("/project/manage");
  await expect(page.getByRole("heading", { name: "Manage projects" })).toBeVisible();
  await page.getByRole("link", { name: "New project", exact: true }).click();
  await page.getByLabel("Project name", { exact: true }).fill("Distribution rollout");
  await page.getByLabel("Client", { exact: true }).fill("Nusantara Distribusi");
  await page.getByLabel("Project URL", { exact: true }).fill(slug);
  await page.getByLabel("Project lead", { exact: true }).fill("Reza");
  await page.getByLabel("Project summary", { exact: true }).fill("A connected distribution workflow.");
  await page.getByLabel("Current focus", { exact: true }).fill("Prepare the warehouse pilot.");
  await page.getByLabel("Total tasks", { exact: true }).fill("10");
  await page.getByLabel("Completed tasks", { exact: true }).fill("3");
  await page.getByLabel("Target handover", { exact: true }).fill("2026-11-20");
  await page.getByLabel("Team notes", { exact: true }).fill("Private staffing allocation.");
  await page.getByRole("button", { name: "Timeline", exact: false }).click();
  await page.getByRole("button", { name: "Add milestone" }).click();
  await page.getByLabel("Milestone name", { exact: true }).fill("Development");
  await page.getByLabel("Milestone start", { exact: true }).fill("2026-10-01");
  await page.getByLabel("Milestone end", { exact: true }).fill("2026-10-30");
  await page.getByLabel("Phase state").selectOption("current");
  await page.getByLabel("Milestone description").fill("Build the warehouse pilot workflow.");
  await page.getByRole("button", { name: /^Dates/ }).click();
  await page.getByRole("button", { name: "Add date", exact: true }).click();
  await page.getByLabel("Date title", { exact: true }).fill("Warehouse training");
  await page.getByLabel("Important date", { exact: true }).fill("2026-11-18");
  await page.getByLabel("Date note (optional)", { exact: true }).fill("Operations leads attend the training session.");
  await page.getByRole("button", { name: "Create project", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Project saved");
  await expect(page).toHaveURL(new RegExp(`/project/manage/${slug}\\?saved=1$`));
  await page.reload();
  await expect(page.getByLabel("Project name", { exact: true })).toHaveValue("Distribution rollout");
  const stale = await context.newPage();
  await stale.goto(`/project/manage/${slug}`);
  await expect(stale.getByRole("heading", { name: "Edit project", exact: true })).toBeVisible();
  await expect(stale.getByLabel("Current focus", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Activity", exact: false }).click();
  await page.getByRole("button", { name: "Add activity" }).click();
  await page.getByLabel("Activity type").selectOption("Visit");
  await page.getByLabel("Activity date").fill("2026-10-19");
  await page.getByLabel("Activity title").fill("Warehouse pilot visit");
  await page.getByLabel("Summary & outcome").fill("Confirmed the pilot stock-transfer workflow.");
  await page.getByLabel("Participants or location").fill("Manado warehouse · Operations and ACTIVID");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("status")).toContainText("Project saved");

  await page.getByRole("button", { name: /^Dates/ }).click();
  await page.getByLabel("Important date", { exact: true }).fill("2026-11-19");
  await page.getByLabel("Date title", { exact: true }).fill("Warehouse team training");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("status")).toContainText("Project saved");

  await stale.getByLabel("Current focus", { exact: true }).fill("An older draft.");
  await stale.getByRole("button", { name: "Save changes" }).click();
  await expect(stale.locator(".manager-form-error")).toContainText("Reload before saving");
  stale.on("dialog", (dialog) => dialog.accept());
  await stale.close();

  const client = await context.newPage();
  const response = await client.goto(`/project/${slug}`);
  expect(await response!.text()).not.toContain("Private staffing allocation.");
  await expect(client.getByRole("heading", { level: 1 })).toHaveText("Distribution rollout");
  await expect(client.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "30");
  await expect(client.getByText("Prepare the warehouse pilot.")).toBeVisible();
  await expect(client.getByRole("heading", { name: "Warehouse pilot visit" })).toBeVisible();
  await expect(client.locator(".process-history-type")).toHaveText("Visit");
  await expect(client.getByText("Sample project", { exact: true })).toHaveCount(0);
  const dates = client.getByRole("region", { name: "Important dates" });
  await expect(dates.getByRole("heading", { name: "Warehouse team training" })).toBeVisible();
  await expect(dates.locator("time")).toHaveText("19 Nov 2026");
  await expect(dates).toContainText("Operations leads attend the training session.");
  await client.close();

  await page.goto(`/project/manage/${slug}`);
  await page.getByRole("button", { name: /^Dates/ }).click();
  await expect(page.getByLabel("Important date", { exact: true })).toHaveValue("2026-11-19");
  await page.getByRole("button", { name: "Remove date 1" }).click();
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("status")).toContainText("Project saved");
  const cleared = await context.newPage();
  await cleared.goto(`/project/${slug}`);
  await expect(cleared.getByRole("region", { name: "Important dates" })).toHaveCount(0);
  await cleared.close();
  await page.getByRole("button", { name: "Activity", exact: false }).click();
  await page.getByRole("button", { name: "Remove activity 1" }).click();
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("status")).toContainText("Project saved");
  await page.getByRole("link", { name: "All projects", exact: true }).click();
  await page.getByRole("searchbox", { name: "Search projects" }).fill("Distribution rollout");
  await expect(page.locator(".manager-project-row")).toHaveCount(1);
  for (const width of [360, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
