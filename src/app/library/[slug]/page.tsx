import { EXAMPLES } from "@/lib/examples";
import ExampleRedirect from "@/components/library/example-redirect";

export function generateStaticParams() {
  return EXAMPLES.map((ex) => ({ slug: ex.key }));
}

export default async function ExamplePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ExampleRedirect slug={slug} />;
}
