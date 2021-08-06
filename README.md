# SSH Quick Connect

Quick links for servers and sites.

[comment]: <> (Checks sites health, ssl certs and domain registration. )

![](./assets/example.png)

## Configuration 

Config file path: `~/Library/Application Support/ssh-quick-connect/config.js`

It is a js file with an exported list.

Config is a list of objects with `type` and `options`.

Available types:

- `command` — command to be run in the terminal
  - `title` — command's title
  - `description` — command hint to be shown
  - `command` — command to be run

- `link` — link to be opened in browser
  - `url` — site's url
    
- `separator` — horizontal line
  
- `label` — non-clickable item as label
  - `title` — label's title
    
- `submenu`— list of items
  - `title` — list's title
  - `items` — list of item objects (same structure as for main list)

### Example
 
```js
module.exports = [
    {
        type: 'command',
        options: {
            title: 'Raspberry Pi',
            description: 'RPi in my home local network',
            command: 'ssh -J root@99.55.77.222:12345 -p 22222 root@localhost'
        }
    },

    { type: 'separator' },

    {
        type: 'label',
        options: {
            label: 'Aurora Hunters'
        }
    },
    {
        type: 'command',
        options: {
            title: 'Aurora',
            command: 'ssh taly@62.113.115.208'
        }
    },
    {
        type: 'link',
        options: {
            url: 'https://auroralights.ru'
        },
    },

    { type: 'separator' },

    {
        type: 'command',
        options: {
            title: 'Capella',
            command: 'ssh -p 32221 taly@capella.pics'
        }
    },
    {
        type: 'link',
        options: {
            url: 'https://capella.pics'
        },
    },

    { type: 'separator' },

    {
        type: 'submenu',
        options: {
            title: 'Example Servers',
            items: [
                {
                    type: 'command',
                    options: {
                        title: 'Example',
                        command: 'ssh root@example.com'
                    }
                },
                {
                    type: 'link',
                    options: {
                        url: 'https://example.com'
                    },
                },
                {
                    type: 'link',
                    options: {
                        url: 'https://hello.example.com/'
                    },
                },
            ]
        }
    },
];
```
