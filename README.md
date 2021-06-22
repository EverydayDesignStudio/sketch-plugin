# EverydayDesignStudio Sketch Plugin

- [Download](../../releases/latest/) the latest release of the plugin
- Un-zip
- Double-click on everydaydesignstudio.sketchplugin


## Instructions
Open the .db SQLite file in _DB Browser for SQLite_.

Go to _Execute SQL_ tab.

Then the run one of the queries below, depending on what UI element you want to create.

Copy the returned data.

Open Sketch and select an artboard or layer under which you'd like the new artboard to be placed.

Then run one of the following plugins:

* _EverydayDesignStudio ➝ Dominant Color - Transfer Animation_
* _EverydayDesignStudio ➝ Dominant Color - Slideshow_
* _EverydayDesignStudio ➝ Altitude Graph_
* _EverydayDesignStudio ➝ Color Bar_
* _EverydayDesignStudio ➝ Time Bar_


Paste in the appropriate data. How you naturally copy it from the database is the correct format.

Click `Okay` and bam! There you go :)


### TODO - Dominant Color - Transfer Animation
Create a collection of boxes from array of RGB and array of percentages. This data comes from the kmeans color detection script for Capra.

**Example Input:**
`4500	41,42,53|123,115,99|100,105,117|58,53,40	0.25,0.17,0.13,0.05`

**Query:**
```sql
SELECT picture_id, colors_rgb, colors_conf FROM pictures WHERE picture_id=?;
```
**Parameters:**
```picture_id=```


**Input Format:**
```
['r, g, b', 'r, g, b', 'r, g, b', ...]
[%, %, %, ...]
```

```
['99, 103, 94', '81, 87, 91', '210, 228, 210', '179, 154, 84', '65, 64, 44']
[0.34, 0.31, 0.13, 0.12, 0.11]
```


### TODO - Dominant Color - Slideshow
Create the color palette UI element seen in the slideshow

**Example Input:**
`4500	41,42,53|123,115,99|100,105,117|58,53,40	0.25,0.17,0.13,0.05`

**Query:**
```sql
SELECT picture_id, colors_rgb, colors_conf FROM pictures WHERE picture_id=?;
```

### Altitude Graph
This feature relies on the `mod(x, y)` function available in SQLite versions >= 3.35.5. You'll need a newer version of **[DB Browser for SQLite](https://nightlies.sqlitebrowser.org/latest/)** >= 3.12.99.

Run the following queries. Then copy the first two columns and paste that data into the plugin.

#### Altitude Graph for Hike

**Parameters**
```
hike=?

128.0 (number of items returned)
NOTE: Query requires the decimal point in order for the script to work
```

**order by Altitude**
```sql
SELECT picture_id, altitude, altrank_hike, color_rank_hike, index_in_hike, mod(altrank_hike, (SELECT count(*) FROM pictures WHERE hike=?)/128.0) AS mod_val
	FROM pictures WHERE hike=? AND mod_val < 1.0 ORDER BY altrank_hike ASC;
```

**order by Color**
```sql
SELECT picture_id, altitude, altrank_hike, color_rank_hike, index_in_hike, mod(altrank_hike, (SELECT count(*) FROM pictures WHERE hike=?)/128.0) AS mod_val
	FROM pictures WHERE hike=? AND mod_val < 1.0 ORDER BY color_rank_hike ASC;
```

**order by Time**
```sql
SELECT picture_id, altitude, altrank_hike, color_rank_hike, index_in_hike, mod(altrank_hike, (SELECT count(*) FROM pictures WHERE hike=?)/128.0) AS mod_val
	FROM pictures WHERE hike=? AND mod_val < 1.0 ORDER BY time ASC;
```


#### Altitude Graph for Archive

**Parameters**
```
128.0 (number of items returned)
NOTE: Query requires the decimal point in order for the script to work
```

**order by Altitude**
```sql
SELECT picture_id, altitude, altrank_global, color_rank_global, time_rank_global, mod(altrank_global, (SELECT count(*) FROM pictures)/128.0) AS mod_val 
	FROM pictures WHERE mod_val < 1.0 ORDER BY altrank_global ASC;
```

**order by Color**
```sql
SELECT picture_id, altitude, altrank_global, color_rank_global, time_rank_global, mod(altrank_global, (SELECT count(*) FROM pictures)/128.0) AS mod_val 
	FROM pictures WHERE mod_val < 1.0 ORDER BY color_rank_global ASC;
```

**order by Time (minute)**
```sql
SELECT picture_id, altitude, altrank_global, color_rank_global, time_rank_global, mod(altrank_global, (SELECT count(*) FROM pictures)/128.0) AS mod_val 
	FROM pictures WHERE mod_val < 1.0 ORDER BY time_rank_global ASC;
```

**order by Time (chronological)**
```sql
SELECT picture_id, altitude, altrank_global, color_rank_global, time_rank_global, minute, mod(altrank_global, (SELECT count(*) FROM pictures)/256.0) AS mod_val 
	FROM pictures WHERE mod_val < 1.0 ORDER BY time ASC;
```

#### (Experimental) Altitude Graph for Archive
_Shows just one point for the average altitude of each Hike_

**Parameters**
```
128.0 (number of items returned)
NOTE: Query requires the decimal point in order for the script to work
```

**order by Altitude**
```sql
SELECT hike_id, avg_altitude, avg_altitude_rank, mod(avg_altitude_rank, (SELECT count(*) FROM hikes)/128.0) AS mod_val 
	FROM hikes WHERE mod_val < 1.0 ORDER BY avg_altitude ASC;
```

**order by Color**
```sql
SELECT hike_id, avg_altitude, avg_altitude_rank, mod(avg_altitude_rank, (SELECT count(*) FROM hikes)/128.0) AS mod_val 
	FROM hikes WHERE mod_val < 1.0 ORDER BY color_rank ASC;
```

**order by Time (chronological)**
```sql
SELECT hike_id, avg_altitude, avg_altitude_rank, mod(avg_altitude_rank, (SELECT count(*) FROM hikes)/128.0) AS mod_val 
	FROM hikes WHERE mod_val < 1.0 ORDER BY start_time ASC;
```


### Color Bar
This feature relies on the `mod(x, y)` function available in SQLite versions >= 3.35.5. You'll need a newer version of **[DB Browser for SQLite](https://nightlies.sqlitebrowser.org/latest/)** >= 3.12.99.

Run the following queries. Then copy the first two columns and paste that data into the plugin.

#### Color Bar for Hike

**Parameters**
```
hike=?

128.0 (number of items returned)
NOTE: Query requires the decimal point in order for the script to work
```

**order by Altitude**
```sql
SELECT picture_id, color_rgb, altrank_hike, color_rank_hike, index_in_hike, mod(altrank_hike, (SELECT count(*) FROM pictures WHERE hike=?)/128.0) AS mod_val
	FROM pictures WHERE hike=? AND mod_val < 1.0 ORDER BY altrank_hike ASC;
```

**order by Color**
```sql
SELECT picture_id, color_rgb, altrank_hike, color_rank_hike, index_in_hike, mod(altrank_hike, (SELECT count(*) FROM pictures WHERE hike=?)/128.0) AS mod_val
	FROM pictures WHERE hike=? AND mod_val < 1.0 ORDER BY color_rank_hike ASC;

```

**order by Time (chronological)**
```sql
SELECT picture_id, color_rgb, altrank_hike, color_rank_hike, index_in_hike, mod(altrank_hike, (SELECT count(*) FROM pictures WHERE hike=?)/128.0) AS mod_val
	FROM pictures WHERE hike=? AND mod_val < 1.0 ORDER BY time ASC;
```

#### Color Bar for Archive

**order by Altitude**
```sql
SELECT picture_id, color_rgb, altrank_global, color_rank_global, time_rank_global, mod(altrank_global, (SELECT count(*) FROM pictures)/1280.0) AS mod_val 
	FROM pictures WHERE mod_val < 1.0 ORDER BY altrank_global ASC;
```

**order by Color**
```sql
SELECT picture_id, color_rgb, altrank_global, color_rank_global, time_rank_global, mod(altrank_global, (SELECT count(*) FROM pictures)/1280.0) AS mod_val 
	FROM pictures WHERE mod_val < 1.0 ORDER BY color_rank_global ASC;
```

**order by Time (minute)**
```sql
SELECT picture_id, color_rgb, altrank_global, color_rank_global, time_rank_global, minute, mod(altrank_global, (SELECT count(*) FROM pictures)/1280.0) AS mod_val 
	FROM pictures WHERE mod_val < 1.0 ORDER BY time_rank_global ASC;
```

**order by Time (chronological)**
```sql
SELECT picture_id, color_rgb, altrank_global, color_rank_global, time_rank_global, minute, mod(altrank_global, (SELECT count(*) FROM pictures)/1280.0) AS mod_val 
	FROM pictures WHERE mod_val < 1.0 ORDER BY time ASC;
```

### Time Bar
Run the following queries. Paste the percentage into the input the plugin.

#### Time Bar (Percentages) for Hike

**Parameters**
```
picture_id=?
hike=?
```
**order by Altitude**
```sql
SELECT CAST((SELECT altrank_hike FROM pictures WHERE picture_id=?) AS REAL)/(SELECT count(*) FROM pictures WHERE hike=?);
```

**order by Color**
```sql
SELECT CAST((SELECT color_rank_hike FROM pictures WHERE picture_id=?) AS REAL)/(SELECT count(*) FROM pictures WHERE hike=?);
```

**order by Time (chronological)**
```sql
SELECT CAST((SELECT index_in_hike FROM pictures WHERE picture_id=?) AS REAL)/(SELECT count(*) FROM pictures WHERE hike=?);
```

#### Time Bar (Percentages) for Archive

**Parameters**
```
picture_id=?
```

**order by Altitude**
```sql
SELECT CAST((SELECT altrank_global FROM pictures WHERE picture_id=?) AS REAL)/(SELECT count(*) FROM pictures);
```

**order by Color**
```sql
SELECT CAST((SELECT color_rank_global FROM pictures WHERE picture_id=?) AS REAL)/(SELECT count(*) FROM pictures);
```

**order by Time (minute)**
```sql
SELECT CAST((SELECT time_rank_global FROM pictures WHERE picture_id=?) AS REAL)/(SELECT count(*) FROM pictures);
```


#### Time Bar for Archive

## Development Guide

_This plugin was created using `skpm`. For a detailed explanation on how things work, checkout the [skpm Readme](https://github.com/skpm/skpm/blob/master/README.md)._

### Usage

Install the dependencies

```bash
npm install
```

Once the installation is done, you can run some commands inside the project folder:

#### Changing any of the Menu items
You'll need to Uninstall the plugin from Sketch.
Completely rebuild it with the command below.
Then double click and install it from the Finder.
This is required when you change stuff at the top level of the `manifest.json`

```bash
npm run build
```

#### Next 2 are main one's you'll use during development on scripts
To watch for changes:

```bash
npm run watch
```

Listen to print in another terminal window:
```bash
skpm log -f
```

#### I never used this one
Additionally, if you wish to run the plugin every time it is built:

```bash
npm run start
```

### Custom Configuration

#### Babel

To customize Babel, you have two options:

- You may create a [`.babelrc`](https://babeljs.io/docs/usage/babelrc) file in your project's root directory. Any settings you define here will overwrite matching config-keys within skpm preset. For example, if you pass a "presets" object, it will replace & reset all Babel presets that skpm defaults to.

- If you'd like to modify or add to the existing Babel config, you must use a `webpack.skpm.config.js` file. Visit the [Webpack](#webpack) section for more info.

#### Webpack

To customize webpack create `webpack.skpm.config.js` file which exports function that will change webpack's config.

```js
/**
 * Function that mutates original webpack config.
 * Supports asynchronous changes when promise is returned.
 *
 * @param {object} config - original webpack config.
 * @param {boolean} isPluginCommand - whether the config is for a plugin command or a resource
 **/
module.exports = function(config, isPluginCommand) {
  /** you can change config here **/
}
```

### Debugging

To view the output of your `console.log`, you have a few different options:

- Use the [`sketch-dev-tools`](https://github.com/skpm/sketch-dev-tools)
- Run `skpm log` in your Terminal, with the optional `-f` argument (`skpm log -f`) which causes `skpm log` to not stop when the end of logs is reached, but rather to wait for additional data to be appended to the input

### Publishing your plugin

```bash
skpm publish <bump>
```

(where `bump` can be `patch`, `minor` or `major`)

`skpm publish` will create a new release on your GitHub repository and create an appcast file in order for Sketch users to be notified of the update.

You will need to specify a `repository` in the `package.json`:

```diff
...
+ "repository" : {
+   "type": "git",
+   "url": "git+https://github.com/ORG/NAME.git"
+  }
...
```
