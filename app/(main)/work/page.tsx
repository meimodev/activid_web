import type { Metadata } from 'next';
import { ProjectShowcase } from '@/components/sections/ProjectShowcase';
import { siteContent } from '@/lib/site-content';
import type { ProjectData } from '@/types/project-showcase.types';

export const metadata: Metadata = {
    title: 'Our Work | ACTIVID',
    description: 'Showcase of our latest creative projects including branding, social media, and production.',
};

export default function WorkPage() {
    const { servicePages } = siteContent;

    // Aggregate and normalize projects from different service categories
    const allProjects: ProjectData[] = [
        // Social Media Projects
        ...servicePages.socialMedia.projects.map(p => ({
            id: `social-${p.id}`,
            client: p.client || 'Unknown Client',
            projectType: p.service || 'Social Media',
            description: p.description || '',
            results: p.result || '',
            mockupImages: [p.image].filter((img): img is string => !!img),
            imageAlts: [p.client ? `${p.client} social media` : 'Social media project'],
        })),

        // Product Photography Projects
        ...servicePages.productPhotography.projects.map((p, i) => ({
            id: `photo-${i}`,
            client: p.client || 'Client',
            projectType: p.title || 'Photography',
            description: p.description || '',
            results: 'Professional product photography session', // Default result if missing
            mockupImages: (p.images || []).filter((img): img is string => !!img),
            imageAlts: p.images?.map((_, idx) => `${p.client || 'Product'} photo ${idx + 1}`) || [],
        })),

        // Video Podcast Main Project
        {
            id: 'podcast-main',
            client: 'Tou Minaesa', // inferred from title
            projectType: servicePages.videoPodcast.mainProject.title || 'Podcast Production',
            description: servicePages.videoPodcast.mainProject.description || '',
            results: servicePages.videoPodcast.mainProject.result || '',
            mockupImages: [servicePages.videoPodcast.mainProject.image].filter((img): img is string => !!img),
            imageAlts: ['Tou Minaesa Podcast'],
        }
    ];

    return (
        <main className="min-h-screen pt-20">
            <ProjectShowcase projects={allProjects} />
        </main>
    );
}
