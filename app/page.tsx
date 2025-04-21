import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Custom Form Builder</h1>
          <p className="text-muted-foreground">Create, deploy, and manage dynamic forms with multilingual support</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Form Builder</CardTitle>
              <CardDescription>Create and configure new forms with multilingual support</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Design forms with various components including text fields, dropdowns, checkboxes, and more.</p>
            </CardContent>
            <CardFooter>
              <Link href="/builder" className="w-full">
                <Button className="w-full">Create New Form</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Form Management</CardTitle>
              <CardDescription>View and manage your existing forms</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Access your deployed forms, view submissions, and make updates to existing forms.</p>
            </CardContent>
            <CardFooter>
              <Link href="/forms" className="w-full">
                <Button variant="outline" className="w-full">
                  View Forms
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
