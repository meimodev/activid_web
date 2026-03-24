export type BboldProductId = "b2" | "b4" | "c" | "lanyard" | "pin";

type BboldLinkSet = {
  whatsApp: string;
  map: string;
  tokopedia?: string;
  shopee?: string;
};

type BboldProduct = {
  id: BboldProductId;
  title: string;
  eyebrow: string;
  summary: string;
  highlights: string[];
  notes: string[];
  images: string[];
  links: BboldLinkSet;
};

const B2_IMAGES = [
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_1_1.jpg?updatedAt=1753773305394",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_1_2.jpg?updatedAt=1753773298954",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_1_3.jpg?updatedAt=1753773298996",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_1_4.jpg?updatedAt=1753773306135",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_1_5.jpg?updatedAt=1753773309253",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_1_6.jpg?updatedAt=1753773313305",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_1_7.jpg?updatedAt=1753773312558",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_1_8.jpg?updatedAt=1753773285267",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_1_9.jpg?updatedAt=1753773285671",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_1_10.jpg?updatedAt=1753773285755",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_1_11.jpg?updatedAt=1753773286562",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_2_1.jpg?updatedAt=1753773292151",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_2_2.jpg?updatedAt=1753773292058",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_2_3.jpg?updatedAt=1753773291866",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_2_4.jpg?updatedAt=1753773296052",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_2_5.jpg?updatedAt=1753773296115",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_2_6.jpg?updatedAt=1753773298561",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_2_7.jpg?updatedAt=1753773298990",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_2_8.jpg?updatedAt=1753773288669",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_2_9.jpg?updatedAt=1753773286586",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_2_10.jpg?updatedAt=1753773292097",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_3_1.jpg?updatedAt=1753773302390",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_3_2.jpg?updatedAt=1753773306123",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_3_3.jpg?updatedAt=1753773302394",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_3_4.jpg?updatedAt=1753773312971",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_3_5.jpg?updatedAt=1753773309366",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_3_6.jpg?updatedAt=1753773306151",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_3_7.jpg?updatedAt=1753773309290",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_3_8.jpg?updatedAt=1753773281997",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_3_9.jpg?updatedAt=1753773279189",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_3_10.jpg?updatedAt=1753773285253",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_4_1.jpg?updatedAt=1753773298558",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_4_2.jpg?updatedAt=1753773296047",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_4_3.jpg?updatedAt=1753773292983",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_4_5.jpg?updatedAt=1753773292185",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_4_6.jpg?updatedAt=1753773292118",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_4_7.jpg?updatedAt=1753773292095",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_4_8.jpg?updatedAt=1753773291833",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_4_9.jpg?updatedAt=1753773291840",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_4_10.jpg?updatedAt=1753773302392",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_5_1.jpg?updatedAt=1753773306686",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_5_2.jpg?updatedAt=1753773312896",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_5_3.jpg?updatedAt=1753773312624",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_5_4.jpg?updatedAt=1753773306123",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_5_5.jpg?updatedAt=1753773305472",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_5_6.jpg?updatedAt=1753773298980",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_5_7.jpg?updatedAt=1753773298991",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_5_8.jpg?updatedAt=1753773286155",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B2%20POTRAIT/b2_part_5_9.jpg?updatedAt=1753773286377",
];

const B4_IMAGES = [
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B4/b4_part_1_1.jpg?updatedAt=1753773279098",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B4/b4_part_1_2.jpg?updatedAt=1753773278645",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B4/b4_part_1_3.jpg?updatedAt=1753773278771",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B4/b4_part_1_4.jpg?updatedAt=1753773271910",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B4/b4_part_1_5.jpg?updatedAt=1753773271451",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B4/b4_part_1_6.jpg?updatedAt=1753773271988",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B4/b4_part_1_7.jpg?updatedAt=1753773278698",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B4/b4_part_1_8.jpg?updatedAt=1753773260251",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B4/b4_part_1_9.jpg?updatedAt=1753773260281",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B4/b4_part_1_10.jpg?updatedAt=1753773278889",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B4/b4_part_3_1.jpg?updatedAt=1753773278565",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B4/b4_part_3_2.jpg?updatedAt=1753773279312",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B4/b4_part_3_3.jpg?updatedAt=1753773278861",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B4/b4_part_3_4.jpg?updatedAt=1753773272882",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B4/b4_part_2_1.jpg?updatedAt=1753773271741",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B4/b4_part_2_2.jpg?updatedAt=1753773271751",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B4/b4_part_2_3.jpg?updatedAt=1753773271734",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B4/b4_part_2_4.jpg?updatedAt=1753773264928",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B4/b4_part_2_5.jpg?updatedAt=1753773264905",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B4/b4_part_2_6.jpg?updatedAt=1753773268440",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B4/b4_part_2_7.jpg?updatedAt=1753773267145",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B4/b4_part_2_8.jpg?updatedAt=1753773264427",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B4/b4_part_2_9.jpg?updatedAt=1753773264445",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B4/b4_part_2_10.jpg?updatedAt=1753773263996",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B4/b4_part_2_11.jpg?updatedAt=1753773263472",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B4/b4_part_2_12.jpg?updatedAt=1753773261776",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B4/b4_part_2_13.jpg?updatedAt=1753773262279",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B4/b4_part_2_14.jpg?updatedAt=1753773264063",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B4/b4_part_2_15.jpg?updatedAt=1753773264116",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B4/b4_part_3_5.jpg?updatedAt=1753773275165",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B4/b4_part_3_6.jpg?updatedAt=1753773271944",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/B4/b4_part_3_7.jpg?updatedAt=1753773272238",
];

const C_IMAGES = [
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/C/C_part_1_1.jpg?updatedAt=1753773325012",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/C/C_part_1_3.jpg?updatedAt=1753773325447",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/C/C_part_1_4.jpg?updatedAt=1753773327123",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/C/C_part_1_5.jpg?updatedAt=1753773327052",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/C/C_part_1_6.jpg?updatedAt=1753773328151",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/C/C_part_1_7.jpg?updatedAt=1753773327173",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/C/C_part_1_8.jpg?updatedAt=1753773320791",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/C/C_part_1_9.jpg?updatedAt=1753773323034",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/C/C_part_1_10.jpg?updatedAt=1753773323953",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/C/C_part_1_12.jpg?updatedAt=1753773323119",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/C/C_part_1_13.jpg?updatedAt=1753773323137",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/C/C_part_1_14.jpg?updatedAt=1753773324704",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/C/C_part_1_16.jpg?updatedAt=1753773324923",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/C/C_part_1_17.jpg?updatedAt=1753773324532",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/C/C_part_1_18.jpg?updatedAt=1753773325406",
];

const LANYARD_IMAGES = [
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Landyard/Landyard_1_1.jpg?updatedAt=1753773318811",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Landyard/Landyard_1_2.jpg?updatedAt=1753773318539",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Landyard/Landyard_1_3.jpg?updatedAt=1753773316488",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Landyard/Landyard_1_4.jpg?updatedAt=1753773320727",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Landyard/Landyard_1_5.jpg?updatedAt=1753773319459",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Landyard/Landyard_1_6.jpg?updatedAt=1753773320691",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Landyard/Landyard_1_7.jpg?updatedAt=1753773320333",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Landyard/Landyard_1_8.jpg?updatedAt=1753773316295",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Landyard/Landyard_1_9.jpg?updatedAt=1753773316782",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Landyard/Landyard_1_10.jpg?updatedAt=1753773313583",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Landyard/Landyard_1_11.jpg?updatedAt=1753773313314",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Landyard%20Key%20Chain/Landyard_KC_1_1.jpg?updatedAt=1753773242483",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Landyard%20Key%20Chain/Landyard_KC_1_2.jpg?updatedAt=1753773242444",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Landyard%20Key%20Chain/Landyard_KC_1_3.jpg?updatedAt=1753773242650",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Landyard%20Key%20Chain/Landyard_KC_1_4.jpg?updatedAt=1753773242530",
];

const PIN_IMAGES = [
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Pin/Pin_1_1.jpg?updatedAt=1753773247691",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Pin/Pin_1_2.jpg?updatedAt=1753773246090",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Pin/Pin_1_3.jpg?updatedAt=1753773246077",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Pin/Pin_1_4.jpg?updatedAt=1753773251416",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Pin/Pin_1_5.jpg?updatedAt=1753773247297",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Pin/Pin_1_6.jpg?updatedAt=1753773251490",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Pin/Pin_1_7.jpg?updatedAt=1753773253635",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Pin/Pin_1_8.jpg?updatedAt=1753773259725",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Pin/Pin_1_9.jpg?updatedAt=1753773257782",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Pin/Pin_1_10.jpg?updatedAt=1753773246002",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Pin/Pin_1_11.jpg?updatedAt=1753773246100",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Pin/Pin_1_12.jpg?updatedAt=1753773247274",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Pin/Pin_1_13.jpg?updatedAt=1753773246227",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Pin/Pin_1_14.jpg?updatedAt=1753773253595",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Pin/Pin_1_15.jpg?updatedAt=1753773252379",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Pin/Pin_1_16.jpg?updatedAt=1753773247744",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Pin/Pin_1_17.jpg?updatedAt=1753773247734",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Pin/Pin_1_18.jpg?updatedAt=1753773254119",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Pin/Pin_1_19.jpg?updatedAt=1753773253676",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Pin/Pin_1_20.jpg?updatedAt=1753773260161",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Pin/Pin_1_21.jpg?updatedAt=1753773259705",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Pin/Pin_1_22.jpg?updatedAt=1753773259675",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Pin/Pin_1_23.jpg?updatedAt=1753773260402",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Pin/Pin_1_24.jpg?updatedAt=1753773253671",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Pin/Pin_1_25.jpg?updatedAt=1753773253759",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Pin/Pin_1_26.jpg?updatedAt=1753773257957",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Pin/Pin_1_27.jpg?updatedAt=1753773259117",
  "https://ik.imagekit.io/geb6bfhmhx/bbold/web_images/Pin/Pin_1_28.jpg?updatedAt=1753773253494",
];

export const bboldProducts: Record<BboldProductId, BboldProduct> = {
  b2: {
    id: "b2",
    title: "B2",
    eyebrow: "HomeDecor / Custom Gifts",
    summary: "Photo, poster, and quote prints in BBOLD's compact signature size.",
    highlights: ["Size B2 (22.5cm x 30cm)", "Rp 95.000"],
    notes: [
      "Penambahan tulisan memakan waktu 1 - 2 hari.",
      "Waktu pekerjaan terhitung setelah design dikonfirmasi.",
    ],
    images: B2_IMAGES,
    links: {
      whatsApp: "https://api.whatsapp.com/send?phone=+6285756681077&text=ORDER-BBOLD-B2",
      map: "https://www.google.com/maps/place/BBOLD.MMXX+TONDANO/@1.3033844,124.9084929,17z/data=!3m1!4b1!4m5!3m4!1s0x328715e2e5de6b81:0x4965ac475ae18d7c!8m2!3d1.3033865!4d124.9106838",
      tokopedia: "https://www.tokopedia.com/bbold/bbold-dekorasi-dinding-size-b2-22-5cm-x-30cm-x-2cm",
      shopee: "https://shopee.co.id/BBOLD-Dekorasi-Dinding-Size-B2-(30cm-x-22.5cm-x-2cm)-i.14752641.3385608954?sp_atk=2726d202-be04-42dd-b01b-3767a6f015cf&xptdk=2726d202-be04-42dd-b01b-3767a6f015cf",
    },
  },
  b4: {
    id: "b4",
    title: "B4",
    eyebrow: "HomeDecor / Custom Gifts",
    summary: "Larger wall decor print option for photo-only or text-enhanced pieces.",
    highlights: ["Size B4 (30cm x 45cm)", "Rp 190.000"],
    notes: [
      "Penambahan tulisan memakan waktu 1 - 2 hari.",
      "Waktu pekerjaan terhitung setelah design dikonfirmasi.",
    ],
    images: B4_IMAGES,
    links: {
      whatsApp: "https://api.whatsapp.com/send?phone=+6285756681077&text=ORDER-BBOLD-B4",
      map: "https://www.google.com/maps/place/BBOLD.MMXX+TONDANO/@1.3033844,124.9084929,17z/data=!3m1!4b1!4m5!3m4!1s0x328715e2e5de6b81:0x4965ac475ae18d7c!8m2!3d1.3033865!4d124.9106838",
      tokopedia: "https://www.tokopedia.com/bbold/bbold-dekorasi-dinding-size-b4-30cm-x-45cm-x-2cm-photo-tulisan",
      shopee: "https://shopee.co.id/BBOLD-I-Dekorasi-Dinding-Size-B4-(45cm-x-30cm-x-2cm)-PHOTO-ONLY-i.14752641.8667438025?sp_atk=3429f840-16e3-46c3-ad22-1914f6b99ae8&xptdk=3429f840-16e3-46c3-ad22-1914f6b99ae8",
    },
  },
  c: {
    id: "c",
    title: "C",
    eyebrow: "HomeDecor / Custom Gifts",
    summary: "Statement-size custom print options for larger photo and quote displays.",
    highlights: ["Size C1 (70cm x 47cm) - Rp 370.000", "Size C2 (91cm x 42cm) - Rp 440.000"],
    notes: [
      "Waktu pekerjaan size C memakan waktu 2 - 3 hari.",
      "Waktu pekerjaan terhitung setelah design terkonfirmasi.",
    ],
    images: C_IMAGES,
    links: {
      whatsApp: "https://api.whatsapp.com/send?phone=+6285756681077&text=ORDER-BBOLD-SIZE-C",
      map: "https://www.google.com/maps/place/BBOLD.MMXX+TONDANO/@1.3033844,124.9084929,17z/data=!3m1!4b1!4m5!3m4!1s0x328715e2e5de6b81:0x4965ac475ae18d7c!8m2!3d1.3033865!4d124.9106838",
    },
  },
  lanyard: {
    id: "lanyard",
    title: "Lanyard",
    eyebrow: "Identity / Merch Products",
    summary: "Printed lanyards, mask straps, and ID cards with tiered bulk pricing.",
    highlights: [
      "Lanyard Sablon 2 Sisi (2cm x 85cm)",
      "Tali Masker Sablon 2 sisi (2cm x 66cm)",
      "ID Card PVC 2 sisi / 1 sisi",
      "Gratis design",
    ],
    notes: [
      "Rp 27.000 untuk 1 - 20 pcs lanyard sablon 2 sisi.",
      "Rp 25.000 untuk 21 - 60 pcs lanyard sablon 2 sisi.",
      "Rp 22.000 untuk 61 - 150 pcs lanyard sablon 2 sisi.",
      "Untuk jumlah lebih besar bisa nego.",
    ],
    images: LANYARD_IMAGES,
    links: {
      whatsApp: "https://api.whatsapp.com/send?phone=+6285756681077&text=ORDER-BBOLD-LANYARD",
      map: "https://www.google.com/maps/place/BBOLD.MMXX+TONDANO/@1.3033844,124.9084929,17z/data=!3m1!4b1!4m5!3m4!1s0x328715e2e5de6b81:0x4965ac475ae18d7c!8m2!3d1.3033865!4d124.9106838",
    },
  },
  pin: {
    id: "pin",
    title: "Pin",
    eyebrow: "Merch / Souvenir Products",
    summary: "Custom badge and keychain pins in multiple sizes with volume pricing.",
    highlights: [
      "Pin gantungan kecil diameter 44",
      "Pin peneti kecil diameter 44",
      "Pin peneti besar diameter 58",
      "Gratis design",
    ],
    notes: [
      "Harga mulai dari Rp 6.500 untuk pin gantungan kecil.",
      "Harga mulai dari Rp 6.000 untuk pin peneti kecil.",
      "Harga mulai dari Rp 7.500 untuk pin peneti besar.",
      "Untuk jumlah lebih besar bisa nego.",
    ],
    images: PIN_IMAGES,
    links: {
      whatsApp: "https://api.whatsapp.com/send?phone=+6285756681077&text=ORDER-BBOLD-PIN",
      map: "https://www.google.com/maps/place/BBOLD.MMXX+TONDANO/@1.3033844,124.9084929,17z/data=!3m1!4b1!4m5!3m4!1s0x328715e2e5de6b81:0x4965ac475ae18d7c!8m2!3d1.3033865!4d124.9106838",
    },
  },
};

export const bboldProductOrder: BboldProductId[] = ["c", "pin", "lanyard", "b2", "b4"];

export function getBboldProduct(id: string) {
  return bboldProducts[id as BboldProductId] ?? null;
}
