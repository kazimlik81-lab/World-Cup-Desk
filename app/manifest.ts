import type { MetadataRoute } from "next";
import {
  SITE_BACKGROUND_COLOR,
  SITE_DESCRIPTION,
  SITE_IMAGE_HEIGHT,
  SITE_IMAGE_PATH,
  SITE_IMAGE_WIDTH,
  SITE_NAME,
  SITE_SHORT_DESCRIPTION,
  SITE_THEME_COLOR
} from "@/lib/site-metadata";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: ".",
    scope: ".",
    display: "standalone",
    background_color: SITE_BACKGROUND_COLOR,
    theme_color: SITE_THEME_COLOR,
    lang: "ru",
    categories: ["sports", "news", "utilities"],
    icons: [
      {
        src: "favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "assets/world-cup-command-center.png",
        sizes: `${SITE_IMAGE_WIDTH}x${SITE_IMAGE_HEIGHT}`,
        type: "image/png",
        purpose: "any"
      }
    ],
    screenshots: [
      {
        src: "assets/world-cup-command-center.png",
        sizes: `${SITE_IMAGE_WIDTH}x${SITE_IMAGE_HEIGHT}`,
        type: "image/png",
        form_factor: "wide",
        label: SITE_SHORT_DESCRIPTION
      }
    ]
  };
}
