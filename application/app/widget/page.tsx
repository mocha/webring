import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import WidgetDemo from "@/components/widget-demo"
import WidgetCode from "@/components/widget-code"

export default function WidgetPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft size={16} className="mr-1" />
          Back to Directory
        </Link>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">Webring Widget</h1>
          <p className="text-xl text-center text-muted-foreground mb-8">
            Add the webring widget to your website to show your membership and help visitors discover other sites.
          </p>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Preview</h2>
            <WidgetDemo colorMode="light" />
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Installation</h2>
            <p className="mb-4">
              Add the following code to your website, preferably just before the closing <code>&lt;/body&gt;</code> tag:
            </p>
            <WidgetCode />
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Configuration Options</h2>
            <div className="bg-muted p-6 rounded-lg">
              <ul className="space-y-4">
                <li>
                  <code className="bg-background px-2 py-1 rounded text-sm">ringlet</code>
                  <p className="mt-1 text-muted-foreground">
                    Optional. Specify a ringlet ID to only show websites from that ringlet.
                  </p>
                </li>
                <li>
                  <code className="bg-background px-2 py-1 rounded text-sm">colormode</code>
                  <p className="mt-1 text-muted-foreground">
                    Optional. Set to "dark" or "light" to match your website's theme. Default is "light".
                  </p>
                </li>
                <li>
                  <code className="bg-background px-2 py-1 rounded text-sm">position</code>
                  <p className="mt-1 text-muted-foreground">
                    Optional. Set to "top" or "bottom" to position the widget. Default is "bottom".
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} Webring Directory</p>
        </div>
      </footer>
    </div>
  )
}

