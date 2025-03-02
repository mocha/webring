# 🎉 webring.fun!

Let's make webrings a thing again! This is the source code and directory that powers https://webring.fun. This is a freeform, easy to update, and easy to integrate webring _for the modren era_.

---

## What the heck is a webring?

Webrings are an [old internet thing](https://en.wikipedia.org/wiki/Webring) where people with personal websites would all link to eachother in order to 1) help readers discover new stuff organically, 2) create loose communities of strangers, and 3) make the internet do its thing.

A combination of `social media` and `search engine optimization` absolutely nuked webrings and they faded in to obscurity. Well, it's 2025, social media sucks, AI makes building websites more accessible than ever, and hosting (like GitHub Pages) is totally free! 🥳

THE TIME TO BRING THEM BACK IS NOW.

---

## Website Entries

Websites are added under the `/directory` folder. Simply copy/paste an existing entry, or if you're so inclined, use the [form on the site]() and submit a PR with your new entry.

Entries are in `yaml`, and look like this:

```yaml
url: "https://your.site.com"
name: "My radical website"
owner: "@person"
owner_type: "Bluesky"
color: "#e5067d"
website_categories:
    - "photography"
    - "haiku"
    - "ska_essays"
ringlets:
    - "superfriends"

```

---

## Ringlets

Ringlets are cool! They're subsections of the full webring, meaning you can use them to create your OWN webring without any extra effort. Here's how it works:

1. Define a ringlet in the `/ringlets/ directory. They only require a few fields:

```
name: "Your Ringlet"
description: "Fans of the 'Beets vs bears' Fan Appreciation and Critique Podcast of Seasons 1-3 of The Hit Sitcom, The Office"
url: "https://www.bearsbeetsbattlestar.com/"
```

2. 