import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormRenderer } from "@/components/form-renderer"
import { getFormBySlug } from "@/app/actions"

export default async function FormPage({ params }: { params: { slug: string } }) {
  // In a real implementation, this would fetch from MongoDB based on the slug
  const form = await getFormBySlug(params.slug)

  if (!form) {
    notFound()
  }

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{form.form_name}</CardTitle>
        </CardHeader>
        <CardContent>
          <FormRenderer components={form.components} formId={form._id} />
        </CardContent>
      </Card>
    </div>
  )
}
