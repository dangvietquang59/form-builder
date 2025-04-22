import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getForms } from '@/app/actions';

export default async function FormsPage() {
    // In a real implementation, this would fetch from MongoDB
    const forms = await getForms();

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Form Management</h1>
                <Link href="/builder">
                    <Button>Create New Form</Button>
                </Link>
            </div>

            {forms.length === 0 ? (
                <div className="text-center py-12">
                    <h2 className="text-xl font-medium mb-2">No forms created yet</h2>
                    <p className="text-muted-foreground mb-6">
                        Get started by creating your first form
                    </p>
                    <Link href="/builder">
                        <Button>Create Form</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {forms.map((form: any) => (
                        <Card key={form._id}>
                            <CardHeader>
                                <CardTitle>{form.form_name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">Route: {form.route}</p>
                                <p className="text-sm text-muted-foreground">
                                    Components: {form.components.length}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Created: {new Date(form.created_at).toLocaleDateString()}
                                </p>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Link href={form.route}>
                                    <Button variant="outline" size="sm">
                                        View Form
                                    </Button>
                                </Link>
                                <Link href={`/submissions/${form._id}`}>
                                    <Button variant="outline" size="sm">
                                        View Submissions
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
