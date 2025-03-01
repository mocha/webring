import Link from "next/link"
import { ArrowLeft, Github, Code } from "lucide-react"
import JoinForm from "@/components/join-form"
import ConnectedWidgetSection from "../../components/connected-widget-section"

export default function JoinPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft size={16} className="mr-1" />
          Back to Directory
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">Join the Webring</h1>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Join our community of personal websites by following these three simple steps.
          </p>

          {/* Section 1: Community Guidelines */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-4 pb-2 border-b border-border">Community Guidelines</h2>
            <div className="prose prose-lg max-w-none">
              <p>
                This webring is a freeform community of humans who have personal websites. Its goal is to connect together those disparate websites to make it easier to find your way around <em>the social web</em>.
              </p>
              
              <p>
                To be included in this directory, your site should be:
              </p>
              <ol>
                  <li><strong>Personal,</strong> as in, it's yours and about stuff you do or make.</li>
                  <li><strong>Not a business</strong> or commercial endeavor, including content sites like professional blogs or newsletters.</li>
                  <li><strong>Generally SFW,</strong> meaning it's not something your friends would panic over if it popped up on their work computer.</li>
                  <li><strong>Not hateful, racist, bigoted, or otherwise crappy.</strong> Go somewhere else to be a jerk.</li>
                </ol>

              <p>All entries are subject to being removed at any time for any reason, but mostly the ones above. Let's all just be cool, okay?</p>
              
            </div>
          </section>

          {/* Section 2: Add Your Website */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-4 pb-2 border-b border-border">1. Add Your Website</h2>
            <p className="text-lg mb-6">
              Fill out the form below with your website details. When you submit, you'll be taken to GitHub 
              where you can create a pull request to add your site to our directory.
            </p>

            <div className="bg-muted p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">How the submission process works</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Fill out the form below with your website details</li>
                <li>Hit submit, which will take you to Github with a pre-filled PR</li>
                <li>If not logged in, GitHub will prompt you to log in</li>
                <li>If you haven't forked the repo, GitHub will prompt you to fork it</li>
                <li>Edit the PR if desired</li>
                <li>Submit the PR for review</li>
              </ol>
            </div>

            <JoinForm />
          </section>

          {/* Section 3: Add the Widget */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-4 pb-2 border-b border-border">2. Add the Widget to Your Site</h2>
            <p className="text-lg mb-6">
              Once your site is approved and added to the directory, add the webring widget to your site 
              using the code snippet below. This connects your site to others in the ring.
            </p>
            
            <div className="mt-8 space-y-6">
              <h3 className="text-xl font-semibold mb-4">Generate Your Widget Code</h3>
              <p className="mb-4">
                Use this tool to generate custom widget code for your website:
              </p>
              <div className="bg-muted p-6 rounded-lg">
                <ConnectedWidgetSection />
              </div>
            </div>
          </section>


      {/* Something else section */}
      <div className="mt-12 text-center border-t border-border pt-8">
        <h2 className="text-3xl font-bold mb-4">Something else?</h2>
        <p className="mb-4 text-muted-foreground">
          Want to report a bug or something else that seems off? Have an idea for a new feature or something? 
          See something that violates the community guidelines? Cool! Submit a ticket in GitHub here.
        </p>
        <a
          href="https://github.com/mocha/webring/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md bg-muted px-6 py-3 text-base font-medium hover:bg-muted/80 transition-colors"
        >
          Submit a Ticket
        </a>
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

