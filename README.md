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

Ringlets are cool! They're subsections of the full webring, meaning you can use them to create your OWN webring without any extra effort. When you include the widget on your site, it will only link to _(on the left, right, and shuffle buttons)_ other sites that are part of the same ringlet.

If your ringlet includes a URL, where it says "Member of ___ webring!", it will link to that URL. If no URL is given, it will link to `webring.fun?ringlet=your-ringlet` so viewers can peruse at their leisure.

Here's how it works:

1. Define a ringlet in the `/ringlets/ directory. They only require a few fields:

```yaml
name: "Your Ringlet"
description: "Fans of the 'Beets V Bears' Fan Appreciation and Critique Podcast of Seasons 1-3 of The Hit Sitcom The Office"
url: "https://www.bearsbeetsbattlestar.com/"
```

2. The filename of your ringlet (without the .yaml part) is it's `id`. Reference that id in your directory entries in the `ringlets:` section.

3. When you (and your friends!) add the widget code to your site(s), include the ringlet:

```html
<script src="https://webring.fun/widget.js"></script>
<script>
  webring.init({
    ringlet: "your-ringlet",
    colormode: "light"
  });
</script>
```

---

## Contributing

Everyone is welcome to contribute, and / or remixes, spinoffs, forks, or any other deviations are also strongly encouraged. If your passion is making the internet a more fun and human place, then we're on the same team.

If you want to run it locally, it's as simple as:

```bash
cd application
npm install
npm run dev
```

The `dev` command also watches the `/directory` and `/ringlets` directories and recompiles the database on any changes.

_If your changes touch the application code,_ consider running `npm run build` first to catch any build errors.

