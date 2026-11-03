# Portfolio asset audit

Audit date: 2 November 2026. Reference: `Complete_3D_Animation_Modeling_Portfolio.pdf`.

The sections below record the original audit. The cleanup that followed is in **Cleanup results**. Nothing was permanently deleted. Extra copies were moved to `archive/public-data`.

## Cleanup results

Completed 2 November 2026. `public/data` now has **1,562 files** (8,432,986,586 bytes). `archive/public-data` has **181 files** (333,643,897 bytes). Together they still total the original **1,743 files** and **8,766,630,483 bytes**.

The first cleanup archived 158 files: the whole `3D animation & gcw` and `modelling & rig` folders, plus category-folder copies inside `zain-drive` and `imran-drive`. This pass archived the remaining **23 exact duplicate groups**, one extra file each. Every pair was hashed again and matched before it was moved. `archive/MANIFEST.json` lists both passes.

No exact duplicate group from the original 173 remains inside `public/data`. Alternate versions were kept. `Spirit logo animation2/Flicker-Burn_Final.mp4` is a different file from `Flicker-Burn_Final_1.mp4`. The gym-interior webps, the House jpgs, and the Modelling stills that were not duplicates stayed in place.

| Extra copy archived | Copy kept |
| --- | --- |
| `Spirit logo animation2/Flicker-Burn_Final_1.mp4` | `Spirit Logo animation/Flicker-Burn_Final_1.mp4` |
| `Booth events/1.png` and `2.png` | The same files in `Booth events/Booth on wheels/` |
| `imran-drive/Comedic scene.mp4` | `zain-drive/Character Animation/Comedic scene.mp4` |
| `Damir_s work/MODELS/` (6 files) | `Damir_s work/Modelling/` |
| Queen’s River `4.webp` | Queen’s River `1.webp` |
| `Exterior/House/1.webp` | `Interior/Modern Apartment/1.webp` |
| Sci-fi Character `4.jpg` | Sci-fi Character `3.jpg` |
| Apartment plan `6(1).jpg` | Apartment plan `6.jpg` |
| Market `5.jpg` | Market `4.jpg` |
| Gym interior `6.jpg`, `7.jpg`, `8.jpg`, `10.jpg` | `Character Models/3D model pushup/` |
| Four dragon frames in the Imran Drive root | The same frames in `2D Game Art/2D character model/` |

Unused files were attached to existing galleries where the work already had a project. New projects were added only for work that had no matching gallery.

| Asset | Gallery |
| --- | --- |
| Two remaining dragon frames | Dragon game art |
| Flownote, Motion graphics, and AllSocials | 2D animation and motion design |
| Building burn down, Scene 04, Scene 09, Snowy scene | Character Animation, section “Additional scenes” |
| Veptos `thumbnail.png` | Environment, beside `Veptos_1_Logo_opt1.mp4` |
| Memsel job-description document | Medical animation for Memsel |
| Showreel | New project, 2D Animation & Motion Design |
| Stinkin Awesome 4K | New project, Character Rigging & Animation |
| Rita scenes, both Parasite scripts, the production screenshot, the hash-named webm, and the copied mov | New project, AI-Assisted Video & Animation |
| DRUO about-us voiceover | New project, Product Animation & Exploded Views |
| Mson PC stills | New project, Product Modeling & Visualization |
| Exploded mechanical still `1.png` | New project, Product Modeling & Visualization |

The hash-named webm and the copied mov have no descriptive filename. They were stored with the Parasite scripts, so they are in the Rita project’s Production section.

Verification on 2 November 2026: all 16 Work categories and all 101 project pages opened. The new sections and their media files responded successfully, including the showreel, the Rita sections, the additional character scenes, the Veptos thumbnail, and the kept duplicate copies. No gallery path points at an archived file. Design and unrelated pages were not changed.

## How the check was made

Every file under `public/data` was hashed with SHA-256. Two files are exact copies only when the hash matches. Same filename with a different hash is treated as a different version, not a duplicate.

| Location | Files | Bytes |
| --- | ---: | ---: |
| `zain-drive` | 1,501 | 6,463,438,016 |
| `imran-drive` | 63 | 1,929,033,101 |
| `3D animation & gcw` | 17 | 173,547,686 |
| `Architectural Visualization` | 79 | 63,449,645 |
| `modelling & rig` | 18 | 62,331,411 |
| `AI-Assisted Video and Animation` | 8 | 28,125,165 |
| `Character Animation Showcase` | 4 | 20,984,552 |
| `Product Animation` | 8 | 16,517,353 |
| `VR Project` | 11 | 7,319,638 |
| `MetaHuman` | 34 | 1,883,916 |
| **Total** | **1,743** | **8,766,630,483** |

Exact duplicate groups: **173**, covering **354** files. Of those, **157** groups are the same file stored in more than one top-level folder. The other **16** groups are copies inside `zain-drive`.

The largest single file is `zain-drive/Stinkin_Awesome_4K-001.mp4` (3,295,943,832 bytes). It is not used by a project gallery and is not named in the portfolio document.

## Document compared with the website

The PDF has eight numbered sections plus a ninth section for the broader 3D, 2D, and AI folders. The website has a matching category for each numbered section. Every named project has a gallery, and every file the document’s links point at is present.

The older inventory categories are still published beside those new categories. That is where the duplicate cards come from.

| PDF section | Website category | Projects | Asset check |
| --- | --- | ---: | --- |
| 1. 3D Animation and Game Character Work | Same name | 3 | Present. Galleries use the full Zain folders, which include more files than the PDF links. |
| 2. Character Animation Showcase | Same name | 4 | Present. One clip each. Exact copies also exist in Zain, and two of them also exist in Imran Drive. |
| 3. Character Modeling and Rigging | Same name | 3 | Present. Galleries include a few stills beyond the four model links in the PDF. |
| 4. MetaHuman and 3D Human Assets | Same name | 1 | Present. All 34 stills match Zain character folders. |
| 5. VR Project | Same name | 1 | Present. The PDF links are reference, models, and animation. The site also shows environment stills. |
| 6. Product Animation and Exploded Views | Same name | 8 | Present. One clip each. |
| 7. Architectural Visualization | `architecture-showcase` | 2 | Present. Room sets are grouped. Two extra exterior sets are included. |
| 8. AI-Assisted Video and Animation | `ai-assisted` | 7 | Present. Product shots also include seven extra Imran clips. |
| 9. General 3D, 2D, and AI folders | Older Work categories | Many drive folders | These are the Zain and Imran libraries, not a second copy of sections 1–8. |

### Where the galleries differ from the PDF links

These are not missing files. The site shows a wider set than the PDF’s individual links.

- **Damir.** The PDF links character models and the final animation. The gallery also includes draft animations, reference images, and the `MODELS` folder. Every file in `MODELS` is an exact copy of a file in `Modelling`.
- **Sergio.** The PDF links are all present: reference, combat reaction, hit reaction, blade attack, pistol attack, run cycle, and rigging. The gallery also includes the GLB files and a dodge clip.
- **Full-body rigging.** The PDF lists four character-model links. The gallery shows five stills from `Cartoonish 3 (father)`. The short copy in `modelling & rig/character rig` has `1.jpg`, `2.jpg`, `4.jpg`, and `5.jpg`, and does not contain `3.jpg`.
- **Stylized / cartoon models.** The PDF lists four model links, the showcase, and one extra cartoon folder. The gallery shows all seven stills in `Cartoonish 2`, the showcase video, and the six `Cartoonish` webps.
- **Interior.** The PDF lists each set separately: luxury kitchen, modern kitchen, bathroom sets 1 and 2, office sets 1 and 2, living room sets 1 and 2, and bedroom sets 1 and 2. The gallery combines those into six room links. The files are all there. Bathroom set 2 (4 files) and office set 2 (10 files) exist only in `Architectural Visualization`. The other 65 interior files are exact copies of Zain folders.
- **Exterior.** The PDF links villas, house landscape, and the Japanese Zen garden. The villa link also includes `Villa Interior-Exterior` and `Villa Design.mp4`.
- **VR.** The PDF says the links are the reference, the models, and an animation preview. The gallery also adds `PhotoStudio` environment stills.
- **Cinematic product shots.** The category folder contains one file, `final video (2).mp4`. The gallery also adds seven clips from `imran-drive/AI product animation/`. Those seven are different files, not copies of the final.
- **Radar description.** The PDF ends the radar sentence with a period. The published summary does not.

## Broken gallery paths

Two paths used by the older **Product animation** card do not exist. The files are one folder deeper than the path says.

| Path the site requests | File that is actually on disk |
| --- | --- |
| `zain-drive/Product Installation/Shelve instal.mp4` | `zain-drive/Product Installation/Shelve installation/Shelve instal.mp4` |
| `zain-drive/Product Installation/water bottle assembly.mp4` | `zain-drive/Product Installation/Water bottle assembly/water bottle assembly.mp4` |

`Light rig.mp4` in that same project is at the path the site uses. No other direct gallery path in the curated projects is missing.

## Duplicate project cards

The same work is reachable from more than one card.

| Card | Also appears as | What matches |
| --- | --- | --- |
| Rain Environment | AI environment, in the older AI category | Exact copy of `Rain Environment.mp4` |
| Interior Visualization and Exterior Visualization | Featured card “Architectural visualization” | Living-room stills and `Villa Design.mp4` |
| Character Animation Showcase clips | Drive cards for `Character Animation` and `Character Animation2` | Amend, infiltration, monologue, and epic-environment clips |
| Modeling and rigging projects | Drive cards for `Rigging Stuff` and `Character Models` | Dinosaur, bird, facial rig, cartoon-man rig, and cartoon stills |
| MetaHuman | Still inside the `Character Models` drive card | All 34 stills |
| VR Photo Gallery Environment | Still inside the `VR work` drive card | The 11 Magnus files, plus the PhotoStudio stills |
| Sports brand animation | `Fictional Sport Brand.mp4` inside `zain-drive/CGI/Portrait/` | Exact copy, different filename |
| Product animation categories | Two category titles | “Product Animation and Exploded Views” and “Product Animation & Exploded Views” are different bodies of work, but the names read as the same category |
| Architectural Visualization | Two category titles | `architecture-showcase` is the two-project PDF category. `architecture` is the older Zain library |
| AI-Assisted Video | Two category titles | `ai-assisted` is the seven-project PDF category. `ai-video` is the older category and still contains the Rain Environment card |

`Stylized character` is not a duplicate of `Stylized / Cartoon Character Models`. The Imran character stills and expression clip have different hashes.

`wounded soldier 1.mp4` is not a copy of `zain-drive/Dorcas Med animation/MedDefender/wounded soldier with blood.mp4`. Same subject in the filename, different file.

`Character Animation2/Idle animations/Idle animation.mp4` (956,076 bytes) is not a copy of the Unreal rig idle clip (2,619,948 bytes). The rig clip matches `Rachel Rig` and the `3D animation & gcw` copy. This is the only same-filename video with two different hashes. Other repeated names such as `1.webp` are different images that happen to share a number.

## Exact copies, and what to keep

Keep the copy the current gallery already uses. Archive the other copy only after the gallery path is confirmed. Do not archive a whole Zain folder when only some files inside it are copies.

### Safe to archive as whole folders

These folders are exact copies of files kept elsewhere, and the website does not use them as the gallery source.

| Archive later | Keep | Why |
| --- | --- | --- |
| `public/data/3D animation & gcw/` (17 files) | `zain-drive/Damir_s work`, `Sergio_s work`, and `Rachel Rig` | All 17 files match Zain. The live galleries use Zain. The short Sergio copy is also missing `Hit reaction.mp4`. |
| `public/data/modelling & rig/` (18 files) | The Zain folders already used by the three modeling-and-rigging galleries | All 18 files match Zain. |

### Keep the category folder, archive only the extra copies

| Keep, because the gallery uses it | Exact copies that can be archived later |
| --- | --- |
| `Character Animation Showcase` (4 clips) | The same four clips inside `zain-drive/Character Animation`, `Character Animation2`, and, for Amend and the monologue, `imran-drive` |
| `Product Animation` (8 clips) | `imran-drive/Puffer jacket.mp4` only. The other seven clips have no second copy |
| `AI-Assisted Video and Animation` | Imran copies of the rain clip, `AI animation.mp4`, `character sheet.jpg`, `3D Brand Intro.mp4`, and `final video (2).mp4`. Also `zain-drive/CGI/Portrait/Fictional Sport Brand.mp4`, which matches `Sport Brand.mp4` |
| `MetaHuman` | The matching stills in `zain-drive/Character Models`: `Full body human`, `Female character`, `Realistic Male Face`, and `3D  human`. Leave the rest of `Character Models` in place |
| `VR Project` | The matching 11 files under `zain-drive/VR work/Magnus` |
| `Architectural Visualization` | Do not archive this folder. Bathroom set 2 and office set 2 exist only here. The other 65 files also exist under `zain-drive/Interior & Exterior/Interior` |

### Copies inside Zain that are not a second library

These are duplicates within `zain-drive`, not a category-folder backup.

- `Damir_s work/MODELS` repeats files in `Damir_s work/Modelling`. The gallery shows both, so the same still appears twice.
- `Spirit Logo animation` and `Spirit logo animation2` share `Flicker-Burn_Final_1.mp4`.
- `Booth events/1.png` and `2.png` match the copies in `Booth events/Booth on wheels`.
- `Character Models/Sci-fi Character/3.jpg` matches `4.jpg` in that same folder.
- `Interior & Exterior/Exterior/House/1.webp` matches `Interior/Modern Apartment/1.webp`.
- `Game assets_/Queen’s River_ Mystery Game/1.webp` matches `4.webp` in that same folder.
- `Floor plans/Apartment plan 2/6.jpg` matches `6(1).jpg`.

`imran-drive/Comedic scene.mp4` matches `zain-drive/Character Animation/Comedic scene.mp4`. That clip is not one of the PDF’s numbered projects.

## What not to archive

- `zain-drive` as a whole. It is the library behind section 9 and behind several live galleries.
- `imran-drive` as a whole. Rita scenes, AI product clips, the character model, and motion files are unique.
- `Stinkin_Awesome_4K-001.mp4`, the large Rita episodes, and `imran-drive/8WYmgYcP4yOKldhCTQl8u.webm`. They are not duplicates. They are also not linked from the PDF’s numbered projects.
- The Dorcas “wounded soldier with blood” clip. It is a different video from the AI soldier sequence.
- The shorter `Idle animation.mp4` in `Character Animation2`. It is a different take from the Unreal rig idle.

## Suggested approval list

1. Archive `3D animation & gcw` and `modelling & rig` after a last look. They add no unique bytes.
2. Archive the extra copies listed above, not their parent folders.
3. Decide whether the older duplicate cards should stay: AI environment, the featured architectural card, and the Zain drive cards that repeat sections 1–8.
4. Fix the two Product Installation paths only when a website change is approved. The files themselves are present.
5. Decide whether the PhotoStudio stills, the extra product-shot clips, and the merged interior links should stay, since they go beyond the PDF’s link list.
