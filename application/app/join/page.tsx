"use client"

import Link from "next/link"
import { ArrowLeft, Github, Code, ChevronDown, ChevronUp } from "lucide-react"
import { useState, ReactNode } from "react"
import JoinForm from "@/components/join-form"
import ConnectedWidgetSection from "../../components/connected-widget-section"

// Accordion component for the join page
interface AccordionProps {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function Accordion({ title, children, isOpen, onToggle }: AccordionProps) {
  return (
    <div className="border border-border rounded-lg mb-4 overflow-hidden">
      <button
        className="w-full p-4 text-left font-semibold text-lg flex justify-between items-center bg-muted/50 hover:bg-muted transition-colors"
        onClick={onToggle}
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div className="p-6 border-t border-border">
          {children}
        </div>
      )}
    </div>
  );
}

export default function JoinPage() {
  const [openSection, setOpenSection] = useState(0);

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? -1 : index);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft size={16} className="mr-1" />
          Back to Directory
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 text-center">Join the ring!</h1>
          <p className="text-xl text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            It's very simple. All you have to do is:
          </p>
          {/* Accordion Section 1: Be a cool person */}
          <Accordion 
            title="1. Be a cool person who made a website." 
            isOpen={openSection === 0}
            onToggle={() => toggleSection(0)}
          >
            <div className="prose prose-lg max-w-none">
            <p className="text-lg mb-6">
                A webring is a freeform community of humans who have <strong>personal websites</strong>. The goal is to connect them together so readers can explore <em>the social web</em> without needing <em>social media</em> to do so. Hypermedia <em>rules</em> y'all.
              </p>
              
              <p className="text-lg mb-6">
                <strong>To be included in this directory, your site should be:</strong>
              </p>

              <ol className="list-decimal pl-5 space-y-2 mb-6">
                <li><strong className="text-blue-500">Personal:</strong> as in it's <span className="underline">your</span> website that <span className="underline">you made</span> for your own unknowable reasons.</li>
                <li><strong className="text-blue-500">Not commercial:</strong> you're not selling stuff or doing it for the revenue (including content sites like professional blogs or newsletters).</li>
                <li><strong className="text-blue-500">At-least-mostly-SFW:</strong> it's not something your boss would panic over if it popped up on your work computer while clicking around the 'ring.</li>
                <li><strong className="text-blue-500">Not mean:</strong> it's not hateful, sexist, racist, bigoted, or otherwise crappy. The internet is <em>vast</em> my friend. Find somewhere else to be a jerk.</li>
              </ol>

              <p className="text-lg mb-6">
                All entries are subject to being removed at any time for any reason, but mostly the ones above. <em>Let's all just be cool, and nice to each other, okay?</em>
              </p>

              <button
                onClick={() => {
                  toggleSection(0); // Close current section
                  toggleSection(1); // Open next section
                }}
                className="mt-4 px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors font-medium"
              >
                Got it. Next! 🫡
              </button>
              
            </div>
          </Accordion>

          {/* Accordion Section 2: Add your website to the directory */}
          <Accordion 
            title="2. Add your website's entry to the directory" 
            isOpen={openSection === 1}
            onToggle={() => toggleSection(1)}
          >

            <p className="text-lg mb-6">
              Great! Fill out the form below with your website details and click the button at the bottom. You&apos;ll be taken to GitHub where you can create a PR (pull request) to add your site to our directory. </p>
              
            <JoinForm />

          </Accordion>

          {/* Accordion Section 3: Add the widget to your site */}
          <Accordion 
            title="3. Add the widget to your site" 
            isOpen={openSection === 2}
            onToggle={() => toggleSection(2)}
          >

            <p className="text-lg mb-6">
              Copy the widget code to your site:
            </p>

            <ConnectedWidgetSection />

            <div className="flex items-center gap-2 p-6 mt-6 mb-6 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm">
                <strong>Alternately:</strong> if you're comfortable jamming out your own code, you can nab the data from <a href="/data/all.json" target="_blank" rel="noopener noreferrer"><code className="bg-blue-100 px-1 py-0.5 rounded">/data/all.json</code></a> (or swap the filename for a ringlet) and make your own navigation thingy! 
              </p>
            </div>

          </Accordion>

          {/* Fun closing section */}
          <Accordion 
            title="4. Yay we're doing a webring!" 
            isOpen={openSection === 3}
            onToggle={() => toggleSection(3)}
          >
            <p className="text-xl font-bold mt-2 mb-6">Find more websites and bring them here!!</p>
              
            <p className="text-lg mb-6">Do <em>your friends</em> have websites? No? They don't? Well, have you considered <em>helping them make one?</em></p>
            
            <p className="text-lg mb-6">Do you have <em>other friends</em> who might have websites and you just haven't asked yet? <em>That's pretty rude maybe you should get to know your friends better!</em></p>

            <p className="text-lg mb-6">
              Perhaps instead, if you just tell them "hey guess what I did today: I joined a webring!" they would be so excited that they would run home, make a website, and join themselves. Just imagine: you could be the change in the world that brings the old, fun internet back.
            </p>
              
            <p className="text-lg mb-6">
              That could be you, and we would all be so proud of you for doing it.
            </p>
              
          </Accordion>

        </div>
      </main>
    </div>
  );
}

