-- Dominant Color - Transfer Animation
SELECT picture_id, colors_rgb, colors_conf FROM pictures WHERE picture_id=4500;


-- Dominant Color - Slideshow
SELECT picture_id, colors_rgb, colors_conf FROM pictures WHERE picture_id=4500;



-------------------------------- Altitude Graph --------------------------------
-- Altitude Graph in Hike --
-- order by Altitude
SELECT picture_id, altitude, altrank_hike, color_rank_hike, index_in_hike, mod(altrank_hike, (SELECT count(*) FROM pictures WHERE hike=10)/128.0) AS mod_val
	FROM pictures WHERE hike=10 AND mod_val < 1.0 ORDER BY altrank_hike ASC;

-- order by Color
SELECT picture_id, altitude, altrank_hike, color_rank_hike, index_in_hike, mod(altrank_hike, (SELECT count(*) FROM pictures WHERE hike=10)/128.0) AS mod_val
	FROM pictures WHERE hike=10 AND mod_val < 1.0 ORDER BY color_rank_hike ASC;

-- order by Time
SELECT picture_id, altitude, altrank_hike, color_rank_hike, index_in_hike, mod(altrank_hike, (SELECT count(*) FROM pictures WHERE hike=10)/128.0) AS mod_val
	FROM pictures WHERE hike=10 AND mod_val < 1.0 ORDER BY time ASC;


-- Altitude Graph in Archive --
-- order by Altitude
SELECT picture_id, altitude, altrank_global, color_rank_global, time_rank_global, mod(altrank_global, (SELECT count(*) FROM pictures)/128.0) AS mod_val 
	FROM pictures WHERE mod_val < 1.0 ORDER BY altrank_global ASC;

-- order by Color
SELECT picture_id, altitude, altrank_global, color_rank_global, time_rank_global, mod(altrank_global, (SELECT count(*) FROM pictures)/128.0) AS mod_val 
	FROM pictures WHERE mod_val < 1.0 ORDER BY color_rank_global ASC;

-- order by Time (minute)
SELECT picture_id, altitude, altrank_global, color_rank_global, time_rank_global, mod(altrank_global, (SELECT count(*) FROM pictures)/128.0) AS mod_val 
	FROM pictures WHERE mod_val < 1.0 ORDER BY time_rank_global ASC;
	
-- order by Time (chronological)
SELECT picture_id, altitude, altrank_global, color_rank_global, time_rank_global, minute, mod(altrank_global, (SELECT count(*) FROM pictures)/256.0) AS mod_val 
	FROM pictures WHERE mod_val < 1.0 ORDER BY time ASC;


-- Altitude Graph in Archive (alternative) --
-- Showing just the average altitude of each Hike
SELECT hike_id, avg_altitude, avg_altitude_rank, mod(avg_altitude_rank, (SELECT count(*) FROM hikes)/128.0) AS mod_val 
	FROM hikes WHERE mod_val < 1.0 ORDER BY avg_altitude ASC;

SELECT hike_id, avg_altitude, avg_altitude_rank, mod(avg_altitude_rank, (SELECT count(*) FROM hikes)/128.0) AS mod_val 
	FROM hikes WHERE mod_val < 1.0 ORDER BY color_rank ASC;
	
SELECT hike_id, avg_altitude, avg_altitude_rank, mod(avg_altitude_rank, (SELECT count(*) FROM hikes)/128.0) AS mod_val 
	FROM hikes WHERE mod_val < 1.0 ORDER BY start_time ASC;



-------------------------------- Color Bar --------------------------------
-- Color Bar in Hike --
-- order by Altitude	
SELECT picture_id, color_rgb, altrank_hike, color_rank_hike, index_in_hike, mod(altrank_hike, (SELECT count(*) FROM pictures WHERE hike=10)/128.0) AS mod_val
	FROM pictures WHERE hike=10 AND mod_val < 1.0 ORDER BY altrank_hike ASC;

-- order by Color
SELECT picture_id, color_rgb, altrank_hike, color_rank_hike, index_in_hike, mod(altrank_hike, (SELECT count(*) FROM pictures WHERE hike=10)/128.0) AS mod_val
	FROM pictures WHERE hike=10 AND mod_val < 1.0 ORDER BY color_rank_hike ASC;

-- order by Time
SELECT picture_id, color_rgb, altrank_hike, color_rank_hike, index_in_hike, mod(altrank_hike, (SELECT count(*) FROM pictures WHERE hike=10)/128.0) AS mod_val
	FROM pictures WHERE hike=10 AND mod_val < 1.0 ORDER BY time ASC;


-- Color Bar in Archive --
-- order by Altitude
SELECT picture_id, color_rgb, altrank_global, color_rank_global, time_rank_global, mod(altrank_global, (SELECT count(*) FROM pictures)/1280.0) AS mod_val 
	FROM pictures WHERE mod_val < 1.0 ORDER BY altrank_global ASC;

-- order by Color
SELECT picture_id, color_rgb, altrank_global, color_rank_global, time_rank_global, mod(altrank_global, (SELECT count(*) FROM pictures)/1280.0) AS mod_val 
	FROM pictures WHERE mod_val < 1.0 ORDER BY color_rank_global ASC;

-- order by Time (minute)
SELECT picture_id, color_rgb, altrank_global, color_rank_global, time_rank_global, minute, mod(altrank_global, (SELECT count(*) FROM pictures)/1280.0) AS mod_val 
	FROM pictures WHERE mod_val < 1.0 ORDER BY time_rank_global ASC;
	
-- order by Time (chronological)
SELECT picture_id, color_rgb, altrank_global, color_rank_global, time_rank_global, minute, mod(altrank_global, (SELECT count(*) FROM pictures)/1280.0) AS mod_val 
	FROM pictures WHERE mod_val < 1.0 ORDER BY time ASC;



----------------------------------- Time Bar -----------------------------------
-- Time Bar (Percentages) in Hike
-- order by Altitude
SELECT CAST((SELECT altrank_hike FROM pictures WHERE picture_id=9294) AS REAL)/(SELECT count(*) FROM pictures WHERE hike=10);

-- order by Color
SELECT CAST((SELECT color_rank_hike FROM pictures WHERE picture_id=9294) AS REAL)/(SELECT count(*) FROM pictures WHERE hike=10);

-- order by Time
SELECT CAST((SELECT index_in_hike FROM pictures WHERE picture_id=9294) AS REAL)/(SELECT count(*) FROM pictures WHERE hike=10);


-- Time Bar (Percentages) in Archive
-- order by Altitude
SELECT CAST((SELECT altrank_global FROM pictures WHERE picture_id=9294) AS REAL)/(SELECT count(*) FROM pictures);

-- order by Color
SELECT CAST((SELECT color_rank_global FROM pictures WHERE picture_id=9294) AS REAL)/(SELECT count(*) FROM pictures);

-- order by Time
SELECT CAST((SELECT time_rank_global FROM pictures WHERE picture_id=9294) AS REAL)/(SELECT count(*) FROM pictures);
