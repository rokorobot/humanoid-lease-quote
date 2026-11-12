import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product name",
  description: "One sentence about the product.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
