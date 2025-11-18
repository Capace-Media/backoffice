import EditTemplate from "../../_components/edit-template";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function EditTemplatePage({ params }: Props) {
  const { slug } = await params;
  return <EditTemplate slug={slug} />;
}
