import { Big_Shoulders_Text, Big_Shoulders_Stencil_Text, Inter } from "next/font/google";

// Google Fonts retired the standalone "Big Shoulders Condensed" family in
// favor of variable-width cuts. "Big Shoulders Text" is its closest
// available match — same condensed, bold athletic character.
export const bigShoulders = Big_Shoulders_Text({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-big-shoulders",
  display: "swap",
});

// Stenciled cut used only for the CROSSFACE wordmark (nav, footer, hero) --
// hollow, gym-equipment letterforms give the brand its own identity apart
// from the body/heading font above.
export const bigShouldersStencil = Big_Shoulders_Stencil_Text({
  subsets: ["latin"],
  weight: "800",
  variable: "--font-big-shoulders-stencil",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});
