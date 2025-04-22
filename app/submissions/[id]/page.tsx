import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getFormById, getFormSubmissions } from '@/app/actions';

export default async function SubmissionsPage({ params }: { params: { id: string } }) {
    // In a real implementation, this would fetch from MongoDB
    const form = await getFormById(params.id);

    if (!form) {
        notFound();
    }

    const submissions = await getFormSubmissions(params.id);

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">{form.form_name} Submissions</h1>
                    <p className="text-muted-foreground">
                        {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <Link href="/forms">
                    <Button variant="outline">Back to Forms</Button>
                </Link>
            </div>

            {submissions.length === 0 ? (
                <div className="text-center py-12">
                    <h2 className="text-xl font-medium mb-2">No submissions yet</h2>
                    <p className="text-muted-foreground mb-6">
                        Share the form link to start collecting responses
                    </p>
                    <div className="flex justify-center">
                        <Link href={form.route}>
                            <Button>View Form</Button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {submissions.map((submission: any) => (
                        <Card key={submission._id}>
                            <CardHeader>
                                <CardTitle className="text-sm text-muted-foreground">
                                    Submitted on{' '}
                                    {new Date(submission.submitted_at).toLocaleString()}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(submission.data).map(
                                        ([key, value]: [string, any]) => {
                                            const component = form.components.find(
                                                (c: any) => c.key === key,
                                            );
                                            if (!component) return null;

                                            return (
                                                <div key={key} className="space-y-1">
                                                    <dt className="text-sm font-medium">
                                                        {component.label.en}
                                                    </dt>
                                                    <dd className="text-sm">
                                                        {Array.isArray(value)
                                                            ? value
                                                                  .map((v: string) => {
                                                                      const option =
                                                                          component.options?.find(
                                                                              (o: any) =>
                                                                                  o.value === v,
                                                                          );
                                                                      return option ? option.en : v;
                                                                  })
                                                                  .join(', ')
                                                            : (() => {
                                                                  if (
                                                                      component.type === 'select' ||
                                                                      component.type === 'radio'
                                                                  ) {
                                                                      const option =
                                                                          component.options?.find(
                                                                              (o: any) =>
                                                                                  o.value === value,
                                                                          );
                                                                      return option
                                                                          ? option.en
                                                                          : value;
                                                                  }
                                                                  return value;
                                                              })()}
                                                    </dd>
                                                </div>
                                            );
                                        },
                                    )}
                                </dl>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
