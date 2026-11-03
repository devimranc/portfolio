export type CategoryId =
  | "game-character"
  | "character-showcase"
  | "character-modeling-rigging"
  | "metahuman"
  | "vr-project"
  | "product-animation-views"
  | "architecture-showcase"
  | "ai-assisted"
  | "character-modeling"
  | "character-rigging"
  | "product-modeling"
  | "product-animation"
  | "unreal-vr"
  | "architecture"
  | "ai-video"
  | "motion-2d";

export type MediaItem = {
  src: string;
  alt: string;
  kind: "image" | "video" | "file";
};

export type Project = {
  slug: string;
  title: string;
  category: CategoryId;
  summary: string;
  details: string[];
  featured?: boolean;
  media: MediaItem[];
};

export const categories: { id: CategoryId; label: string }[] = [
  { id: "game-character", label: "3D Animation and Game Character Work" },
  { id: "character-showcase", label: "Character Animation Showcase" },
  { id: "character-modeling-rigging", label: "Character Modeling and Rigging" },
  { id: "metahuman", label: "MetaHuman and 3D Human Assets" },
  { id: "vr-project", label: "VR Project" },
  { id: "product-animation-views", label: "Product Animation and Exploded Views" },
  { id: "architecture-showcase", label: "Architectural Visualization" },
  { id: "ai-assisted", label: "AI-Assisted Video and Animation" },
  { id: "character-modeling", label: "3D Modeling & Character Modeling" },
  { id: "character-rigging", label: "Character Rigging & Animation" },
  { id: "product-modeling", label: "Product Modeling & Visualization" },
  { id: "product-animation", label: "Product Animation & Exploded Views" },
  { id: "unreal-vr", label: "Unreal Engine" },
  { id: "architecture", label: "Architectural Visualization" },
  { id: "ai-video", label: "AI-Assisted Video & Animation" },
  { id: "motion-2d", label: "2D Animation & Motion Design" },
];

const d = (path: string) => `/data/${path}`;

export const projects: Project[] = [
  {
    slug: "damir-project",
    title: "Damir Project – Cleanup, Rigging and Procedural Animation",
    category: "game-character",
    summary:
      "I received a character model generated using Meshy AI and Mixamo. I cleaned up the asset, improved topology and UVs, set up accurate rigging, and integrated it into Unity for procedural animation. The goal was to turn the generated starting asset into a cleaner, usable character setup for an interactive project.",
    details: [],
    media: [
      {
        kind: "image",
        src: d("zain-drive/Damir_s work/Modelling/image (31).png"),
        alt: "image (31).png",
      },
    ],
  },
  {
    slug: "sergio-project",
    title: "Sergio Project – Retro Game Character Animation",
    category: "game-character",
    summary:
      "Working from the client's game-character reference, I handled rigging and combat-related animation for a retro-style game character. The supplied clips cover combat and hit reactions, blade and pistol attacks, and a run cycle, alongside the rigging example.",
    details: [],
    media: [
      {
        kind: "video",
        src: d("zain-drive/Sergio_s work/Retro Combat reactions/Combat reactions.mp4"),
        alt: "Combat reactions.mp4",
      },
    ],
  },
  {
    slug: "character-rigs-for-unreal-engine",
    title: "Character Rigs for Unreal Engine",
    category: "game-character",
    summary:
      "I created rigs for character models provided by the client and integrated them into Unreal Engine. The collection includes an idle animation and examples for cop, female, and male characters.",
    details: [],
    media: [
      {
        kind: "image",
        src: d("zain-drive/Rachel Rig/Idle rig/Rig point.png"),
        alt: "Rig point.png",
      },
    ],
  },
  {
    slug: "amend-cinematic-character-showcase",
    title: "Amend – Cinematic Character Showcase",
    category: "character-showcase",
    summary:
      "I created this project almost entirely in Unreal Engine. Textures were created in Substance Painter, while terrain textures were developed in Photoshop. The project combines a character with a cinematic environment and is a showcase of my Unreal Engine scene work.",
    details: [],
    media: [
      {
        kind: "video",
        src: d("Character Animation Showcase/The Amend .mp4"),
        alt: "The Amend .mp4",
      },
    ],
  },
  {
    slug: "infiltration-sequence",
    title: "Infiltration Sequence",
    category: "character-showcase",
    summary: "A character-focused infiltration sequence presented in a cinematic scene.",
    details: [],
    media: [
      {
        kind: "video",
        src: d("Character Animation Showcase/Infiltration Animation draft.mp4"),
        alt: "Infiltration Animation draft.mp4",
      },
    ],
  },
  {
    slug: "short-monologue",
    title: "Short Monologue",
    category: "character-showcase",
    summary: "A short character performance built around a monologue.",
    details: [],
    media: [
      {
        kind: "video",
        src: d("Character Animation Showcase/Short monologue.mp4"),
        alt: "Short monologue.mp4",
      },
    ],
  },
  {
    slug: "character-in-an-epic-environment",
    title: "Character in an Epic Environment",
    category: "character-showcase",
    summary: "A character showcase set within a large-scale environment.",
    details: [],
    media: [
      {
        kind: "video",
        src: d("Character Animation Showcase/Character with Epic Environment.mp4"),
        alt: "Character with Epic Environment.mp4",
      },
    ],
  },
  {
    slug: "full-body-facial-and-character-rigging",
    title: "Full-Body, Facial and Character Rigging",
    category: "character-modeling-rigging",
    summary:
      "This collection presents character models alongside full-body rigging and facial-expression-related work. The links include model examples, a rigging showcase, and facial expression work.",
    details: [],
    media: [
      {
        kind: "image",
        src: d("zain-drive/Character Models/Cartoonish 3 (father)/1.jpg"),
        alt: "Character model example",
      },
    ],
  },
  {
    slug: "animal-rigging-dinosaur-and-bird",
    title: "Animal Rigging – Dinosaur and Bird",
    category: "character-modeling-rigging",
    summary: "This collection includes animal rigging examples for a dinosaur and a bird.",
    details: [],
    media: [
      {
        kind: "video",
        src: d("zain-drive/Rigging Stuff/Dino Rig/Dino Rig - video demo.mp4"),
        alt: "Dinosaur rig",
      },
    ],
  },
  {
    slug: "stylized-cartoon-character-models",
    title: "Stylized / Cartoon Character Models",
    category: "character-modeling-rigging",
    summary:
      "I created stylized, cartoon-like character models and prepared a character showcase. These links include individual models, the showcase, and an additional folder of cartoon-style models.",
    details: [],
    media: [
      {
        kind: "image",
        src: d("zain-drive/Character Models/Cartoonish 2/1.jpg"),
        alt: "Stylized character model",
      },
    ],
  },
  {
    slug: "metahuman-and-3d-human-assets",
    title: "MetaHuman and 3D Human Assets",
    category: "metahuman",
    summary:
      "This collection includes a full-body human, realistic male and female characters, and a low-poly 3D human.",
    details: [],
    media: [
      {
        kind: "image",
        src: d("MetaHuman/full-body-human/1.webp"),
        alt: "Full-body human",
      },
    ],
  },
  {
    slug: "stylized-character",
    title: "Stylized character",
    category: "character-modeling",
    featured: true,
    summary:
      "Character stills and a facial-performance clip from the character model set.",
    details: [
      "The set includes full-body and close-up stills of a stylized male character.",
      "A separate clip shows the rigged model with facial expressions.",
    ],
    media: [
      {
        kind: "image",
        src: d("imran-drive/Character model/Character model/1 (1).jpg"),
        alt: "Stylized character, full body and close-up",
      },
      {
        kind: "image",
        src: d("imran-drive/Character model/Character model/2.jpg"),
        alt: "Stylized character still",
      },
      {
        kind: "image",
        src: d("imran-drive/Character model/Character model/3.jpg"),
        alt: "Stylized character still",
      },
      {
        kind: "image",
        src: d("imran-drive/Character model/Character model/4.jpg"),
        alt: "Stylized character still",
      },
      {
        kind: "image",
        src: d("imran-drive/Character model/Character model/5.jpg"),
        alt: "Stylized character still",
      },
      {
        kind: "video",
        src: d(
          "imran-drive/Character model/Rig with expressions/Rigged model with expression.mp4",
        ),
        alt: "Rigged character with facial expressions",
      },
    ],
  },
  {
    slug: "vr-photo-gallery",
    title: "VR Photo Gallery Environment",
    category: "vr-project",
    featured: true,
    summary:
      "Working from a provided reference, I created a photo-gallery environment and its 3D models, then integrated the environment into VR. The links include the reference, models, and an animation preview.",
    details: [],
    media: [
      {
        kind: "image",
        src: d("zain-drive/VR work/PhotoStudio map/VR PhotoStudio.png"),
        alt: "VR photo gallery environment",
      },
    ],
  },
  {
    slug: "memsel-medical-animation",
    title: "Medical animation for Memsel",
    category: "product-animation",
    summary:
      "Three animations for two products for the medical company Memsel. Footage is withheld under NDA.",
    details: [
      "The shots include blood from a wound, cross-sections, a bandaged and injured soldier, hospital shots, and a helicopter carrying the soldier.",
      "Further detail and the animation files are not published because of an NDA.",
    ],
    media: [
      {
        kind: "file",
        src: d("imran-drive/JOB DESCRIPTION_.docx"),
        alt: "Memsel job description",
      },
    ],
  },
  {
    slug: "product-material-refinement",
    title: "Product material refinement",
    category: "product-modeling",
    summary:
      "Refinement of an existing 3D product model for a photorealistic result.",
    details: [
      "The work was enhancing PBR materials, improving surface realism, optimizing the lighting setup, and adjusting camera composition.",
      "The stills for this delivery are not included in the public gallery.",
    ],
    media: [],
  },
  {
    slug: "product-stills",
    title: "Product modeling stills",
    category: "product-modeling",
    summary: "Product modeling stills of a book and a camera.",
    details: [
      "These are finished stills from the product model library.",
      "They are separate from the PBR refinement described on its own page.",
    ],
    media: [
      {
        kind: "image",
        src: d("zain-drive/3D model/Book/1.jpg"),
        alt: "Ornate book product still",
      },
      {
        kind: "image",
        src: d("zain-drive/3D model/Book/2.jpg"),
        alt: "Book product still",
      },
      {
        kind: "image",
        src: d("zain-drive/3D model/Book/3.jpg"),
        alt: "Book product still",
      },
      {
        kind: "image",
        src: d("zain-drive/3D model/Camera/1.jpg"),
        alt: "Camera product still",
      },
      {
        kind: "image",
        src: d("zain-drive/3D model/Camera/2.jpg"),
        alt: "Camera product still",
      },
      {
        kind: "image",
        src: d("zain-drive/3D model/Camera/3.jpg"),
        alt: "Camera product still",
      },
    ],
  },
  {
    slug: "radar-exploded-view-animation",
    title: "Radar – Exploded View Animation",
    category: "product-animation-views",
    summary:
      "An exploded-view animation presenting a radar unit and its components in a structured visual breakdown",
    details: [],
    media: [
      {
        kind: "video",
        src: d("Product Animation/Rader animation.mp4"),
        alt: "Radar exploded view",
      },
    ],
  },
  {
    slug: "watch-exploded-view-animation",
    title: "Watch – Exploded View Animation",
    category: "product-animation-views",
    summary:
      "A watch exploded-view animation that separates the product into components to show their arrangement.",
    details: [],
    media: [
      {
        kind: "video",
        src: d("Product Animation/Epic Watch .mp4"),
        alt: "Watch exploded view",
      },
    ],
  },
  {
    slug: "drinks-product-animation",
    title: "Drinks Product Animation",
    category: "product-animation-views",
    summary: "A product animation featuring drinks as the focus of a dedicated visual sequence.",
    details: [],
    media: [
      {
        kind: "video",
        src: d("Product Animation/Flavoured Drink.mp4"),
        alt: "Drinks product animation",
      },
    ],
  },
  {
    slug: "watch-launch-animation",
    title: "Watch Launch Animation",
    category: "product-animation-views",
    summary: "A launch-style watch animation created to present the product in a promotional format.",
    details: [],
    media: [
      {
        kind: "video",
        src: d("Product Animation/Watch launch.mp4"),
        alt: "Watch launch animation",
      },
    ],
  },
  {
    slug: "computer-mouse-animation",
    title: "Computer Mouse Animation",
    category: "product-animation-views",
    summary: "A product-focused 3D animation presenting a computer mouse and its design.",
    details: [],
    media: [
      {
        kind: "video",
        src: d("Product Animation/Blender Mouse Animation .mp4"),
        alt: "Computer mouse animation",
      },
    ],
  },
  {
    slug: "perfume-product-animation",
    title: "Perfume Product Animation",
    category: "product-animation-views",
    summary:
      "A product animation featuring a perfume bottle, with emphasis on the product and packaging.",
    details: [],
    media: [
      {
        kind: "video",
        src: d("Product Animation/Perfume.mp4"),
        alt: "Perfume product animation",
      },
    ],
  },
  {
    slug: "puffer-jacket-animation",
    title: "Puffer Jacket Animation",
    category: "product-animation-views",
    summary: "A product-focused animation featuring a puffer jacket.",
    details: [],
    media: [
      {
        kind: "video",
        src: d("Product Animation/Puffer jacket.mp4"),
        alt: "Puffer jacket animation",
      },
    ],
  },
  {
    slug: "glasses-product-animation",
    title: "Glasses Product Animation",
    category: "product-animation-views",
    summary: "A 3D product animation featuring eyeglasses and their overall design.",
    details: [],
    media: [
      {
        kind: "video",
        src: d("Product Animation/Quality glasses.mp4"),
        alt: "Glasses product animation",
      },
    ],
  },
  {
    slug: "product-animation",
    title: "Product animation",
    category: "product-animation",
    summary: "Product installation and assembly animations.",
    details: [
      "The clips show a light rig, a shelf installation, a water-bottle assembly, an antenna installation, and a product demo.",
    ],
    media: [
      {
        kind: "video",
        src: d("zain-drive/Product Installation/Light rig.mp4"),
        alt: "Light rig animation",
      },
      {
        kind: "video",
        src: d("zain-drive/Product Installation/Shelve installation/Shelve instal.mp4"),
        alt: "Shelf installation animation",
      },
      {
        kind: "video",
        src: d("zain-drive/Product Installation/Water bottle assembly/water bottle assembly.mp4"),
        alt: "Water bottle assembly animation",
      },
      {
        kind: "video",
        src: d("zain-drive/Product Installation/Antenna Installation/Antenna installation.mp4"),
        alt: "Antenna installation animation",
      },
      {
        kind: "video",
        src: d("zain-drive/Product Installation/Product demo and explainer.mp4"),
        alt: "Product demo and explainer",
      },
    ],
  },
  {
    slug: "interior-visualization-collection",
    title: "Interior Visualization",
    category: "architecture-showcase",
    summary:
      "This collection includes interior visualization examples across luxury and modern kitchens, bathrooms, offices, living rooms, and bedrooms.",
    details: [],
    media: [
      {
        kind: "image",
        src: d("Architectural Visualization/luxury-kitchen/1.webp"),
        alt: "Luxury kitchen visualization",
      },
    ],
  },
  {
    slug: "exterior-visualization",
    title: "Exterior Visualization",
    category: "architecture-showcase",
    summary:
      "The exterior collection includes villa visualizations, a house landscape, and a Japanese Zen garden.",
    details: [],
    media: [
      {
        kind: "image",
        src: d("zain-drive/Interior & Exterior/Exterior/Villa/1.webp"),
        alt: "Villa visualization",
      },
    ],
  },
  {
    slug: "rain-environment",
    title: "Rain Environment",
    category: "ai-assisted",
    summary: "An environment-focused visual piece built around a rain setting.",
    details: [],
    media: [
      {
        kind: "video",
        src: d("AI-Assisted Video and Animation/Rain Environment/Rain Environment.mp4"),
        alt: "Rain environment",
      },
    ],
  },
  {
    slug: "ai-character-animation-seedance",
    title: "AI Character Animation – Seedance 2.5",
    category: "ai-assisted",
    summary:
      "I used Seedance 2.5 and a character sheet to create a short AI-generated sequence featuring a male character, a female character, and a pigeon as part of the scene.",
    details: [],
    media: [
      {
        kind: "image",
        src: d("AI-Assisted Video and Animation/AI Character/character sheet.jpg"),
        alt: "Character sheet",
      },
    ],
  },
  {
    slug: "ai-assisted-cinematic-product-shots",
    title: "AI-Assisted Cinematic Product Shots",
    category: "ai-assisted",
    summary:
      "I created a series of cinematic product animation shots using AI-assisted workflows, turning product concepts into visually engaging promotional content.",
    details: [],
    media: [
      {
        kind: "video",
        src: d("AI-Assisted Video and Animation/AI-Assisted Cinematic/final video (2).mp4"),
        alt: "Cinematic product shots",
      },
    ],
  },
  {
    slug: "cinematic-brand-intro",
    title: "Cinematic Brand Intro",
    category: "ai-assisted",
    summary:
      "I created a premium 15–20 second cinematic brand intro using AI-assisted creative and 3D workflows, including realistic environments, water, atmospheric effects, cinematic camera movement, and lighting.",
    details: [],
    media: [
      {
        kind: "video",
        src: d("AI-Assisted Video and Animation/Cinematic Brand Intro/3D Brand Intro.mp4"),
        alt: "Cinematic brand intro",
      },
    ],
  },
  {
    slug: "ai-workflow-animation-coffee",
    title: "AI Workflow Animation – Coffee",
    category: "ai-assisted",
    summary: "An AI-assisted animation sequence centered on a coffee product or brand.",
    details: [],
    media: [
      {
        kind: "video",
        src: d("AI-Assisted Video and Animation/AI Workflow Animation — Coffee/Coffee .mp4"),
        alt: "Coffee animation",
      },
    ],
  },
  {
    slug: "ai-workflow-animation-sports-brand",
    title: "AI Workflow Animation – Sports Brand",
    category: "ai-assisted",
    summary: "An AI-assisted animation sequence created for a sports brand concept.",
    details: [],
    media: [
      {
        kind: "video",
        src: d("AI-Assisted Video and Animation/AI Workflow Animation — Sports Brand/Sport Brand.mp4"),
        alt: "Sports brand animation",
      },
    ],
  },
  {
    slug: "wounded-soldier-and-medic-sequence",
    title: "Wounded Soldier and Medic Sequence",
    category: "ai-assisted",
    summary:
      "I created a war-environment sequence showing a badly wounded soldier while a medic attempts to treat him. AI tools were used to create a realistic setting and depict the intense moment of injury.",
    details: [],
    media: [
      {
        kind: "video",
        src: d("AI-Assisted Video and Animation/Wounded Soldier/wounded soldier 1.mp4"),
        alt: "Wounded soldier sequence",
      },
    ],
  },
  {
    slug: "dragon-game-art",
    title: "Dragon game art",
    category: "motion-2d",
    featured: true,
    summary:
      "Splash, store, and character-select art, plus dragon character frames.",
    details: [
      "The game title is not recorded in the filenames, so this set is labeled from the artwork.",
    ],
    media: [
      {
        kind: "image",
        src: d("imran-drive/2D Game Art/splash-screen3.jpg"),
        alt: "Dragon game splash screen",
      },
      {
        kind: "image",
        src: d("imran-drive/2D Game Art/]PLAYSTORE-SCREENS1.jpg"),
        alt: "Store screen",
      },
      {
        kind: "image",
        src: d("imran-drive/2D Game Art/]PLAYSTORE-SCREENS2.jpg"),
        alt: "Store screen",
      },
      {
        kind: "image",
        src: d("imran-drive/2D Game Art/]PLAYSTORE-SCREENS3.jpg"),
        alt: "Store screen",
      },
      {
        kind: "image",
        src: d("imran-drive/2D Game Art/charcter-selectionSCREEN-4.png"),
        alt: "Character selection screen",
      },
      {
        kind: "image",
        src: d("imran-drive/2D Game Art/charcter-selectionSCREEN-5.png"),
        alt: "Character selection screen",
      },
      {
        kind: "image",
        src: d("imran-drive/2D Game Art/2D character model/DRAGON1-ANIMATION-1.png"),
        alt: "Dragon character frame",
      },
      {
        kind: "image",
        src: d(
          "imran-drive/2D Game Art/2D character model/DRAGON1-ANIMATION-FILE3.png",
        ),
        alt: "Dragon character frame",
      },
      {
        kind: "image",
        src: d("imran-drive/2D Game Art/2D character model/DRAGON1-ANIMATION-FILE.png"),
        alt: "Dragon character frame",
      },
      {
        kind: "image",
        src: d("imran-drive/2D Game Art/2D character model/DRAGON1-ANIMATION-FILE2.png"),
        alt: "Dragon character frame",
      },
    ],
  },
  {
    slug: "motion-design",
    title: "2D animation and motion design",
    category: "motion-2d",
    summary: "Short 2D character, loop, and motion clips.",
    details: [
      "The clips are a character animation, a cartoon animation, a turn, a loop, and an icon sequence.",
      "Motion-graphics clips and a social-story layout from Imran Drive are included.",
    ],
    media: [
      {
        kind: "video",
        src: d("zain-drive/2D/2D Animation/2D Character animation.mp4"),
        alt: "2D character animation",
      },
      {
        kind: "video",
        src: d("zain-drive/2D/2D Animation/Cartoon animation.mp4"),
        alt: "Cartoon animation",
      },
      {
        kind: "video",
        src: d("zain-drive/2D/2D character rig/180 DEGREE TURN.mp4"),
        alt: "180 degree character turn",
      },
      {
        kind: "video",
        src: d("zain-drive/2D/2D Looped animation/loop animation.mp4"),
        alt: "Looped animation",
      },
      {
        kind: "video",
        src: d("zain-drive/2D/Icon + Object/Icons+Object.mp4"),
        alt: "Icon and object animation",
      },
      {
        kind: "video",
        src: d("imran-drive/Motion graphics/Flownote.mp4"),
        alt: "Flownote motion graphics",
      },
      {
        kind: "video",
        src: d("imran-drive/Motion graphics/Motion graphics.mp4"),
        alt: "Motion graphics",
      },
      {
        kind: "image",
        src: d("imran-drive/AllSocials.WEBP"),
        alt: "Social story layout",
      },
    ],
  },
  {
    slug: "showreel",
    title: "Showreel",
    category: "motion-2d",
    summary: "A 13-second showreel.",
    details: [],
    media: [
      {
        kind: "video",
        src: d("zain-drive/Showreel/Showreel.mp4"),
        alt: "Showreel",
      },
    ],
  },
  {
    slug: "stinkin-awesome",
    title: "Stinkin Awesome",
    category: "character-rigging",
    summary: "A seven-minute 4K animation.",
    details: [],
    media: [
      {
        kind: "video",
        src: d("zain-drive/Stinkin_Awesome_4K-001.mp4"),
        alt: "Stinkin Awesome",
      },
    ],
  },
  {
    slug: "rita-ai-scenes",
    title: "Rita AI scenes",
    category: "ai-video",
    summary:
      "AI-assisted Parasite and IronBlood scenes, with monster, prom, and saving-the-principal episodes, plus the scripts and production files stored with them.",
    details: [],
    media: [
      {
        kind: "video",
        src: d("imran-drive/Rita AI scenes/Monster/Parasite_Ep POV Monster-FA.mp4"),
        alt: "Parasite monster episode",
      },
    ],
  },
  {
    slug: "druo-about-us",
    title: "DRUO About Us",
    category: "product-animation",
    summary: "A short about-us voiceover for DRUO.",
    details: [],
    media: [
      {
        kind: "video",
        src: d("imran-drive/DRUO About Us (Just Voiceover) V 2.0_10sec.mp4"),
        alt: "DRUO about us voiceover",
      },
    ],
  },
  {
    slug: "mson-pc-components",
    title: "Mson PC components",
    category: "product-modeling",
    summary: "Exploded product stills of a PC chassis and its components.",
    details: [],
    media: [
      {
        kind: "image",
        src: d("imran-drive/Mson PC components/image (11).png"),
        alt: "PC chassis and components",
      },
      {
        kind: "image",
        src: d("imran-drive/Mson PC components/image (12).png"),
        alt: "PC component still",
      },
    ],
  },
  {
    slug: "mechanical-assembly",
    title: "Mechanical assembly",
    category: "product-modeling",
    summary: "An exploded still of a mechanical assembly.",
    details: [],
    media: [
      {
        kind: "image",
        src: d("imran-drive/1.png"),
        alt: "Exploded mechanical assembly",
      },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function categoryLabel(id: CategoryId) {
  return categories.find((category) => category.id === id)?.label ?? id;
}

export function isCategoryId(value: string): value is CategoryId {
  return categories.some((category) => category.id === value);
}

export function projectsByCategory(id: CategoryId) {
  return projects.filter((project) => project.category === id);
}

export function coverMedia(items: MediaItem[]) {
  return items.find((item) => item.kind === "image") ?? items[0];
}

export function categoryCover(id: CategoryId) {
  const list = projectsByCategory(id);
  for (const project of list) {
    const image = project.media.find((item) => item.kind === "image");
    if (image) return image;
  }
  for (const project of list) {
    if (project.media[0]) return project.media[0];
  }
  return undefined;
}

export const services = [
  {
    id: "3d-modeling",
    title: "3D Modeling",
    body: "Character and product modeling, from stylized character stills to object visualization such as the book and camera sets.",
  },
  {
    id: "character-rigging",
    title: "Character Rigging & Animation",
    body: "Cleanup of supplied character models, including topology, UVs, and rigging, plus combat reactions, run cycles, and facial performance. One character was integrated into Unity for procedural animation.",
  },
  {
    id: "product-visualization",
    title: "Product Visualization & Animation",
    body: "PBR material, lighting, and camera refinement for photorealistic product stills, along with product installation and assembly animation. Medical product animation has also been delivered for Memsel, with the footage kept private under NDA.",
  },
  {
    id: "unreal-vr",
    title: "Unreal Engine",
    body: "Character rigs integrated into Unreal Engine, and a photo gallery environment with models integrated into VR for client testing.",
  },
  {
    id: "architecture",
    title: "Architectural Visualization",
    body: "Interior stills and camera walkthroughs of houses and a villa exterior.",
  },
  {
    id: "ai-video",
    title: "AI-Assisted Video Production",
    body: "AI-assisted environment video, including a rain environment. Supplied AI-generated character models have also been cleaned up and rigged for production use.",
  },
];
