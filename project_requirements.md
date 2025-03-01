We're going to bring webrings back. They need to be easy to make, easy to join, and simple to use.

The goals of this project are twofold:

1. We need an application that can serve as the central webring directory.
2. We need a javascript widget that can be easily added to a website.

There's only one way to do this right. We need to build it ourselves.

---

## Directory Strucutre

This repository is structured in monorepo way that makes it simplest for folks unfamiliar with web applications to navigate:

- `/application` - houses the next/react-based web application
- `/directory` - houses the website listings
- `/ringlets` - houses the ringlet listings
- `/server` - houses the python-based api server for the widget

---

## Listings

Each website entry will have the following properties:
- URL
    - The URL of the website
    - String
    - Required
    - Unique
- Name
    - The name of the website to display
    - String
    - Required
- Description
    - A short description of the website
    - String
    - Optional
- Owner
    - The owner of the website. Handle, @username, email, whatever.
    - String
    - Required
- Owner Type
    - The type data that the owner field contains. e.g. "Bluesky", "Email", "Website"
    - String
- Color
    - The color to be used for the website in the directory listing
    - String
- Website Categories
    - Array of Strings
- Ringlets
    - Array of Strings

Data is stored in simple yaml files in the `directory` directory. Each file is a listing for a website that follows the following format

```yaml
url: https://example.com
name: The Name of the Website
description: A short description of the website
owner: @username
owner_type: Bluesky
color: #012581
website_categories:
    - category1
    - category2
ringlets:
    - ringlet1_id
    - ringlet2_id
```

Files can be named anything or stored in any subdirectory. There will be a script that will be called by the CI pipeline to scan and parse the directory, loading all the data into a single JSON file that will be used by the web application at runtime.

That JSON file will be stored in the `public` directory, and named `data.json`. The other cool thing about having this stored in that directory is that it can be easily served as static content by the application so that someone else can use it as a data source for their own thing.

---

## Ringlets

"Ringlets" are subgroups. These are freeform groups that allow you to use this webring for your own purposes. An entry in the directory can have one or many ringlets specified, and on the site, ringlets are displayed as a filter.

When adding the widget to your site, you can specify a ringlet, and the widget will only display websites that are in the specified ringlet, and the links in the widget will only take you to websites that are in the specified ringlet.

Ringlets are stored in the `ringlets` directory. Each file is a ringlet that follows the following format

```yaml
name: The Name of the Ringlet
description: The Description of the Ringlet
link: The URL of whatever it's referencing or related to
```

The fields are:
- `name`
    - The name of the ringlet
    - String, Required
- `description`
    - A description of the ringlet
    - String
- `link`
    - The URL of whatever it's referencing or related to
    - String

The "id" of the ringlet is the filename of the file, and when a listing specifies a "ringlet_id", this is what it is referencing.

---

## Application

The application itself is a minimalistic directory of websites that are members of the webring.

### The directory page

The directory page is a simple grid or list of websites. 

1. A table of webring sites.
    - It should be a big, chunky, vertical list of websites.
    - When you hover over a website, the background should use the color specified in the website listing in some way. Perhaps it could underline the name, or border the box, or something--tasteful, but fun.
    - When you click on a website, it should open a detail view of the website listing. The background should use the color specified in the website listing.
    - The table should scroll vertically, but horizontally it should be fluid and expand to the width of the window, at least up to a certain point.
1. A filter bar with dropdown selectors for categories and ringlets
    - The filter bar should have a dropdown for each category and ringlet.
    - When you select a category or ringlet from their respective dropdowns, it should update the table to show only the websites that match the selected filters.
    - Users can select one category and/or one ringlet at a time.
    - The filters can be cleared by selecting the "All Categories" or "All Ringlets" options.
1. A detail view of a website listing, visible when a directory listing is clicked.
    - The detail view should show the website name, description (if available), owner, URL, and a list of categories and ringlets.
    - Clicking on categories or ringlets in the detail view will set the corresponding filter.
    - It should have a big and fun "Visit" button that takes you to the website.

At the bottom of the page, there should be a footer with a CTA to join the webring, which takes you to the "Get added" page.

---

## Administration

### Directory Management

The directory is entirely managed through github. Users can submit a PR to add or update a website listing. If it's a new listing, the PR will be reviewed and merged by an admin. If it's an update to an existing listing, the PR will automatically be merged _as long as the PR submittor is the same as the orignially submittor of the listing_. These rules should be managed and enforced through Github, using native features like github actions.

To add a new listing, the user will need to create a new file in the `directory` directory. The file should be named after the website, and should be a valid YAML file.

The same goes for ringlets -- they are stored in the `ringlets` directory, and a user will need to create a new file to add one. The CI pipeline for adding a new directory listing will check to see if this ringlet exists, if one is specified. If not, it will throw a CI error.

### The "Get added" page

On the website, there is a page that has a form for adding a website to the webring. At the top of the page, it explains the instructions for submission:

1. Fill out the form
1. Hit submit, which will take you to Github with a pre-filled PR
1. (If not logged in) GitHub will make you log in
1. (If you haven't forked the repo) GitHub will make you fork the repo
1. Edit the PR if desired
1. Submit the PR

Below is a simple form with all of the website listing fields.

When the user is done, they hit submit, which will take them to Github where they follow the steps outlined above.

---

## Widget

The widget is a simple javascript widget that can be added to a website. It has the following elements:

1. Membership title - "This website is a member of the [ring or name of ringlet]"
    - When clicked, it will take you to the directory page, and if a ringlet was specified, it will filter for that ringlet automatically.
1. Left / Right arrow buttons, which cycle through the websites in the ringlet. Each button will show a popup with the website it will take you to on hover (or tap, on mobile).
    - The next/previous movement in data is referring to your order in either the full directory or the ringlet, depending on if you have selected a ringlet. This means that the left arrow will take the user to the entry above yours, and the right arrow will take the user to the entry below yours.
1. A "Random page" button, which takes you to a random website in the ring or ringlet.

### Creation

The documentation for the widget is in the README.md of the webring. It provides a sample code block with a few options pre-filled, and documentation on what can be customized with an example each.

### Look and feel

When added to a site, it adds a single-line-height footer either an 80% black or white background, depending on what the user specified.

###

Example pseudocode for the widget:

```html
<script src="https://webring.example.com/widget.js"></script>
<script>
    webring.init({
        ringlet: "my-ringlet"
        colormode: "light",
    });
</script>
```

---

Widget service

The widget service is a simple high performance API that returns JSON for the data to be used by the widget.

GET /website/{website_url_from_referrer}?ringlet={ringlet_id}

Returns a JSON object with the following fields:

```json
{
    "link_next_name": "Bob's website",
    "link_next_url": "https://bobs-website.com",
    "link_prev_name": "Alice's website",
    "link_prev_url": "https://alices-website.com",
    "random_link_url": "https://random-website.com",
    "ringlet_name": "My kickass ringlet",
}
```

The `?ringlet={ringlet_id}` is optional, and if it is not provided, the widget will display all websites in the directory. If it is provided, the widget will display only the websites in the specified ringlet.

---

## Data importing

Run from the `/application` folder, the `npm run prebuild` command invokes a build script that:

1. Reads all of the ringlets from the `/ringlets` directory, adding them to a `ringlets` dictionary 
1. Reads all of the entries from the `/directory` directory, adding them to a `websites` dictionary
1. Creates a new json file at `/application/public/data/full-ring.json`, overwriting an existing file with a blank one, which contains two json dictionaries, one for ringlets and one for websites
1. Outputs a console note about how many entries were successfully imported and the file path of the output
1. Creates a series of json files, one for each ringlet, at `/application/public/{ringlet-name}.json`, which contains all of the `website` objects that listed the given ringlets in its `ringlets` property
1. Outputs a console note about how many entries were successfully imported and the file path of the output
