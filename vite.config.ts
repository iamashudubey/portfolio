import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import profile from "./src/data/profile.json" with { type: "json" };

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

// Fills the {{...}} placeholders in index.html from profile.json, so the page
// title, description and share preview always match your details.
const profileSeo = (): Plugin => ({
  name: "profile-seo",
  transformIndexHtml(html) {
    const siteUrl = profile.meta.siteUrl.replace(/\/$/, "");
    const values: Record<string, string> = {
      SITE_TITLE: profile.meta.siteTitle,
      SITE_DESCRIPTION: profile.meta.description,
      THEME_COLOR: profile.meta.themeColor,
      SITE_URL: siteUrl,
      OG_IMAGE: `${siteUrl}${profile.personal.profileImage}`,
    };
    return html.replace(/\{\{(\w+)\}\}/g, (match, key: string) =>
      key in values ? escapeHtml(values[key]) : match
    );
  },
});

export default defineConfig({
  plugins: [react(), profileSeo()],
});
