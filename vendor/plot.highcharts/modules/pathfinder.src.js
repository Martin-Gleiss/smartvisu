/**
 * @license Highcharts JS v6.2.0 (2018-10-17)
 * Pathfinder
 *
 * (c) 2016 Øystein Moseng
 *
 * --- WORK IN PROGRESS ---
 *
 * License: www.highcharts.com/license
 */
'use strict';
(function (factory) {
	if (typeof module === 'object' && module.exports) {
		module.exports = factory;
	} else if (typeof define === 'function' && define.amd) {
		define(function () {
			return factory;
		});
	} else {
		factory(Highcharts);
	}
}(function (Highcharts) {
	var algorithms = (function (H) {
		/**
		 * (c) 2016 Highsoft AS
		 * Author: Øystein Moseng
		 *
		 * License: www.highcharts.com/license
		 */

		var min = Math.min,
		    max = Math.max,
		    abs = Math.abs,
		    pick = H.pick;

		/**
		 * Get index of last obstacle before xMin. Employs a type of binary search, and
		 * thus requires that obstacles are sorted by xMin value.
		 *
		 * @param {Array} obstacles Array of obstacles to search in.
		 * @param {Number} xMin The xMin threshold.
		 * @param {Number} startIx Starting index to search from. Must be within array
		 *  range.
		 *
		 * @return {Number} result The index of the last obstacle element before xMin.
		 */
		function findLastObstacleBefore(obstacles, xMin, startIx) {
		    var left = startIx || 0, // left limit
		        right = obstacles.length - 1, // right limit
		        min = xMin - 0.0000001, // Make sure we include all obstacles at xMin
		        cursor,
		        cmp;
		    while (left <= right) {
		        cursor = (right + left) >> 1;
		        cmp = min - obstacles[cursor].xMin;
		        if (cmp > 0) {
		            left = cursor + 1;
		        } else if (cmp < 0) {
		            right = cursor - 1;
		        } else {
		            return cursor;
		        }
		    }
		    return left > 0 ? left - 1 : 0;
		}

		/**
		 * Test if a point lays within an obstacle.
		 *
		 * @param {Object} obstacle Obstacle to test.
		 * @param {Object} point Point with x/y props.
		 *
		 * @return {Boolean} result Whether point is within the obstacle or not.
		 */
		function pointWithinObstacle(obstacle, point) {
		    return (
		        point.x <= obstacle.xMax &&
		        point.x >= obstacle.xMin &&
		        point.y <= obstacle.yMax &&
		        point.y >= obstacle.yMin
		    );
		}

		/**
		 * Find the index of an obstacle that wraps around a point.
		 * Returns -1 if not found.
		 *
		 * @param {Array} obstacles Obstacles to test.
		 * @param {Object} point Point with x/y props.
		 *
		 * @return {Number} result Ix of the obstacle in the array, or -1 if not found.
		 */
		function findObstacleFromPoint(obstacles, point) {
		    var i = findLastObstacleBefore(obstacles, point.x + 1) + 1;
		    while (i--) {
		        if (obstacles[i].xMax >= point.x &&
		            // optimization using lazy evaluation
		            pointWithinObstacle(obstacles[i], point)) {
		            return i;
		        }
		    }
		    return -1;
		}

		/**
		 * Get SVG path array from array of line segments.
		 *
		 * @param {Array} segments The segments to build the path from.
		 *
		 * @return {Array} result SVG path array as accepted by the SVG Renderer.
		 */
		function pathFromSegments(segments) {
		    var path = [];
		    if (segments.length) {
		        path.push('M', segments[0].start.x, segments[0].start.y);
		        for (var i = 0; i < segments.length; ++i) {
		            path.push('L', segments[i].end.x, segments[i].end.y);
		        }
		    }
		    return path;
		}

		/**
		 * Limits obstacle max/mins in all directions to bounds. Modifies input
		 * obstacle.
		 *
		 * @param {Object} obstacle Obstacle to limit.
		 * @param {Object} bounds Bounds to use as limit.
		 */
		function limitObstacleToBounds(obstacle, bounds) {
		    obstacle.yMin = max(obstacle.yMin, bounds.yMin);
		    obstacle.yMax = min(obstacle.yMax, bounds.yMax);
		    obstacle.xMin = max(obstacle.xMin, bounds.xMin);
		    obstacle.xMax = min(obstacle.xMax, bounds.xMax);
		}



		// Define the available pathfinding algorithms.
		// Algorithms take up to 3 arguments: starting point, ending point, and an
		// options object.
		var algorithms = {

		    /**
		     * Get an SVG path from a starting coordinate to an ending coordinate.
		     * Draws a straight line.
		     *
		     * @param {Object} start Starting coordinate, object with x/y props.
		     * @param {Object} end Ending coordinate, object with x/y props.
		     *
		     * @return {Object} result An object with the SVG path in Array form as
		     *  accepted by the SVG renderer, as well as an array of new obstacles
		     *  making up this path.
		     */
		    straight: function (start, end) {
		        return {
		            path: ['M', start.x, start.y, 'L', end.x, end.y],
		            obstacles: [{ start: start, end: end }]
		        };
		    },

		    /**
		     * Find a path from a starting coordinate to an ending coordinate, using
		     * right angles only, and taking only starting/ending obstacle into
		     * consideration.
		     *
		     *  Options
		     *      - chartObstacles:   Array of chart obstacles to avoid
		     *      - startDirectionX:  Optional. True if starting in the X direction.
		     *                          If not provided, the algorithm starts in the
		     *                          direction that is the furthest between
		     *                          start/end.
		     *
		     * @param {Object} start Starting coordinate, object with x/y props.
		     * @param {Object} end Ending coordinate, object with x/y props.
		     * @param {Object} options Options for the algorithm.
		     *
		     * @return {Object} result An object with the SVG path in Array form as
		     *  accepted by the SVG renderer, as well as an array of new obstacles
		     *  making up this path.
		     */
		    simpleConnect: H.extend(function (start, end, options) {
		        var segments = [],
		            endSegment,
		            dir = pick(
		                options.startDirectionX,
		                abs(end.x - start.x) > abs(end.y - start.y)
		            ) ? 'x' : 'y',
		            chartObstacles = options.chartObstacles,
		            startObstacleIx = findObstacleFromPoint(chartObstacles, start),
		            endObstacleIx = findObstacleFromPoint(chartObstacles, end),
		            startObstacle,
		            endObstacle,
		            prevWaypoint,
		            waypoint,
		            waypoint2,
		            useMax,
		            endPoint;

		        // Return a clone of a point with a property set from a target object,
		        // optionally with an offset
		        function copyFromPoint(from, fromKey, to, toKey, offset) {
		            var point = {
		                x: from.x,
		                y: from.y
		            };
		            point[fromKey] = to[toKey || fromKey] + (offset || 0);
		            return point;
		        }

		        // Return waypoint outside obstacle
		        function getMeOut(obstacle, point, direction) {
		            var useMax = abs(point[direction] - obstacle[direction + 'Min']) >
		                        abs(point[direction] - obstacle[direction + 'Max']);
		            return copyFromPoint(
		                point,
		                direction,
		                obstacle,
		                direction + (useMax ? 'Max' : 'Min'),
		                useMax ? 1 : -1
		            );
		        }

		        // Pull out end point
		        if (endObstacleIx > -1) {
		            endObstacle = chartObstacles[endObstacleIx];
		            waypoint = getMeOut(endObstacle, end, dir);
		            endSegment = {
		                start: waypoint,
		                end: end
		            };
		            endPoint = waypoint;
		        } else {
		            endPoint = end;
		        }

		        // If an obstacle envelops the start point, add a segment to get out,
		        // and around it.
		        if (startObstacleIx > -1) {
		            startObstacle = chartObstacles[startObstacleIx];
		            waypoint = getMeOut(startObstacle, start, dir);
		            segments.push({
		                start: start,
		                end: waypoint
		            });

		            // If we are going back again, switch direction to get around start
		            // obstacle.
		            if (
		                waypoint[dir] > start[dir] ===  // Going towards max from start
		                waypoint[dir] > endPoint[dir]   // Going towards min to end
		            ) {
		                dir = dir === 'y' ? 'x' : 'y';
		                useMax = start[dir] < end[dir];
		                segments.push({
		                    start: waypoint,
		                    end: copyFromPoint(
		                        waypoint,
		                        dir,
		                        startObstacle,
		                        dir + (useMax ? 'Max' : 'Min'),
		                        useMax ? 1 : -1
		                    )
		                });

		                // Switch direction again
		                dir = dir === 'y' ? 'x' : 'y';
		            }
		        }

		        // We are around the start obstacle. Go towards the end in one
		        // direction.
		        prevWaypoint = segments.length ?
		            segments[segments.length - 1].end :
		            start;
		        waypoint = copyFromPoint(prevWaypoint, dir, endPoint);
		        segments.push({
		            start: prevWaypoint,
		            end: waypoint
		        });

		        // Final run to end point in the other direction
		        dir = dir === 'y' ? 'x' : 'y';
		        waypoint2 = copyFromPoint(waypoint, dir, endPoint);
		        segments.push({
		            start: waypoint,
		            end: waypoint2
		        });

		        // Finally add the endSegment
		        segments.push(endSegment);

		        return {
		            path: pathFromSegments(segments),
		            obstacles: segments
		        };
		    }, {
		        requiresObstacles: true
		    }),

		    /**
		     * Find a path from a starting coordinate to an ending coordinate, taking
		     * obstacles into consideration. Might not always find the optimal path,
		     * but is fast, and usually good enough.
		     *
		     *  Options
		     *      - chartObstacles:   Array of chart obstacles to avoid
		     *      - lineObstacles:    Array of line obstacles to jump over
		     *      - obstacleMetrics:  Object with metrics of chartObstacles cached
		     *      - hardBounds:       Hard boundaries to not cross
		     *      - obstacleOptions:  Options for the obstacles, including margin
		     *      - startDirectionX:  Optional. True if starting in the X direction.
		     *                          If not provided, the algorithm starts in the
		     *                          direction that is the furthest between
		     *                          start/end.
		     *
		     * @param {Object} start Starting coordinate, object with x/y props.
		     * @param {Object} end Ending coordinate, object with x/y props.
		     * @param {Object} options Options for the algorithm.
		     *
		     * @return {Object} result An object with the SVG path in Array form as
		     *  accepted by the SVG renderer, as well as an array of new obstacles
		     *  making up this path.
		     */
		    fastAvoid: H.extend(function (start, end, options) {
		        /*
		            Algorithm rules/description
		            - Find initial direction
		            - Determine soft/hard max for each direction.
		            - Move along initial direction until obstacle.
		            - Change direction.
		            - If hitting obstacle, first try to change length of previous line
		              before changing direction again.

		            Soft min/max x = start/destination x +/- widest obstacle + margin
		            Soft min/max y = start/destination y +/- tallest obstacle + margin

		            TODO:
		                - Make retrospective, try changing prev segment to reduce
		                  corners
		                - Fix logic for breaking out of end-points - not always picking
		                  the best direction currently
		                - When going around the end obstacle we should not always go the
		                  shortest route, rather pick the one closer to the end point
		        */
		        var dirIsX = pick(
		                options.startDirectionX,
		                abs(end.x - start.x) > abs(end.y - start.y)
		            ),
		            dir = dirIsX ? 'x' : 'y',
		            segments,
		            useMax,
		            extractedEndPoint,
		            endSegments = [],
		            forceObstacleBreak = false, // Used in clearPathTo to keep track of
		                                    // when to force break through an obstacle.

		            // Boundaries to stay within. If beyond soft boundary, prefer to
		            // change direction ASAP. If at hard max, always change immediately.
		            metrics = options.obstacleMetrics,
		            softMinX = min(start.x, end.x) - metrics.maxWidth - 10,
		            softMaxX = max(start.x, end.x) + metrics.maxWidth + 10,
		            softMinY = min(start.y, end.y) - metrics.maxHeight - 10,
		            softMaxY = max(start.y, end.y) + metrics.maxHeight + 10,

		            // Obstacles
		            chartObstacles = options.chartObstacles,
		            startObstacleIx = findLastObstacleBefore(chartObstacles, softMinX),
		            endObstacleIx = findLastObstacleBefore(chartObstacles, softMaxX);

		        // How far can you go between two points before hitting an obstacle?
		        // Does not work for diagonal lines (because it doesn't have to).
		        function pivotPoint(fromPoint, toPoint, directionIsX) {
		            var firstPoint,
		                lastPoint,
		                highestPoint,
		                lowestPoint,
		                i,
		                searchDirection = fromPoint.x < toPoint.x ? 1 : -1;

		            if (fromPoint.x < toPoint.x) {
		                firstPoint = fromPoint;
		                lastPoint = toPoint;
		            } else {
		                firstPoint = toPoint;
		                lastPoint = fromPoint;
		            }

		            if (fromPoint.y < toPoint.y) {
		                lowestPoint = fromPoint;
		                highestPoint = toPoint;
		            } else {
		                lowestPoint = toPoint;
		                highestPoint = fromPoint;
		            }

		            // Go through obstacle range in reverse if toPoint is before
		            // fromPoint in the X-dimension.
		            i = searchDirection < 0 ?
		                // Searching backwards, start at last obstacle before last point
		                min(findLastObstacleBefore(chartObstacles, lastPoint.x),
		                    chartObstacles.length - 1) :
		                // Forwards. Since we're not sorted by xMax, we have to look
		                // at all obstacles.
		                0;

		            // Go through obstacles in this X range
		            while (chartObstacles[i] && (
		                searchDirection > 0 && chartObstacles[i].xMin <= lastPoint.x ||
		                searchDirection < 0 && chartObstacles[i].xMax >= firstPoint.x
		            )) {
		                // If this obstacle is between from and to points in a straight
		                // line, pivot at the intersection.
		                if (
		                    chartObstacles[i].xMin <= lastPoint.x &&
		                    chartObstacles[i].xMax >= firstPoint.x &&
		                    chartObstacles[i].yMin <= highestPoint.y &&
		                    chartObstacles[i].yMax >= lowestPoint.y
		                ) {
		                    if (directionIsX) {
		                        return {
		                            y: fromPoint.y,
		                            x: fromPoint.x < toPoint.x ?
		                                chartObstacles[i].xMin - 1 :
		                                chartObstacles[i].xMax + 1,
		                            obstacle: chartObstacles[i]
		                        };
		                    }
		                    // else ...
		                    return {
		                        x: fromPoint.x,
		                        y: fromPoint.y < toPoint.y ?
		                            chartObstacles[i].yMin - 1 :
		                            chartObstacles[i].yMax + 1,
		                        obstacle: chartObstacles[i]
		                    };
		                }

		                i += searchDirection;
		            }

		            return toPoint;
		        }

		        /**
		         * Decide in which direction to dodge or get out of an obstacle.
		         * Considers desired direction, which way is shortest, soft and hard
		         * bounds.
		         *
		         * Returns a string, either xMin, xMax, yMin or yMax.
		         *
		         * @param {Object} obstacle Obstacle to dodge/escape.
		         * @param {Object} fromPoint Point with x/y props that's
		         * dodging/escaping.
		         * @param {Object} toPoint Goal point.
		         * @param {Boolean} dirIsX Dodge in X dimension.
		         * @param {Object} bounds Hard and soft boundaries.
		         *
		         * @return {Boolean} result Use max or not.
		         */
		        function getDodgeDirection(
		            obstacle,
		            fromPoint,
		            toPoint,
		            dirIsX,
		            bounds
		        ) {
		            var softBounds = bounds.soft,
		                hardBounds = bounds.hard,
		                dir = dirIsX ? 'x' : 'y',
		                toPointMax = { x: fromPoint.x, y: fromPoint.y },
		                toPointMin = { x: fromPoint.x, y: fromPoint.y },
		                minPivot,
		                maxPivot,
		                maxOutOfSoftBounds = obstacle[dir + 'Max'] >=
		                                    softBounds[dir + 'Max'],
		                minOutOfSoftBounds = obstacle[dir + 'Min'] <=
		                                    softBounds[dir + 'Min'],
		                maxOutOfHardBounds = obstacle[dir + 'Max'] >=
		                                    hardBounds[dir + 'Max'],
		                minOutOfHardBounds = obstacle[dir + 'Min'] <=
		                                    hardBounds[dir + 'Min'],
		                // Find out if we should prefer one direction over the other if
		                // we can choose freely
		                minDistance = abs(obstacle[dir + 'Min'] - fromPoint[dir]),
		                maxDistance = abs(obstacle[dir + 'Max'] - fromPoint[dir]),
		                // If it's a small difference, pick the one leading towards dest
		                // point. Otherwise pick the shortest distance
		                useMax = abs(minDistance - maxDistance) < 10 ?
		                        fromPoint[dir] < toPoint[dir] :
		                        maxDistance < minDistance;

		            // Check if we hit any obstacles trying to go around in either
		            // direction.
		            toPointMin[dir] = obstacle[dir + 'Min'];
		            toPointMax[dir] = obstacle[dir + 'Max'];
		            minPivot = pivotPoint(fromPoint, toPointMin, dirIsX)[dir] !==
		                        toPointMin[dir];
		            maxPivot = pivotPoint(fromPoint, toPointMax, dirIsX)[dir] !==
		                        toPointMax[dir];
		            useMax = minPivot ?
		                (maxPivot ? useMax : true) :
		                (maxPivot ? false : useMax);

		            // useMax now contains our preferred choice, bounds not taken into
		            // account. If both or neither direction is out of bounds we want to
		            // use this.

		            // Deal with soft bounds
		            useMax = minOutOfSoftBounds ?
		                (maxOutOfSoftBounds ? useMax : true) : // Out on min
		                (maxOutOfSoftBounds ? false : useMax); // Not out on min

		            // Deal with hard bounds
		            useMax = minOutOfHardBounds ?
		                (maxOutOfHardBounds ? useMax : true) : // Out on min
		                (maxOutOfHardBounds ? false : useMax); // Not out on min

		            return useMax;
		        }

		        // Find a clear path between point
		        function clearPathTo(fromPoint, toPoint, dirIsX) {
		            // Don't waste time if we've hit goal
		            if (fromPoint.x === toPoint.x && fromPoint.y === toPoint.y) {
		                return [];
		            }

		            var dir = dirIsX ? 'x' : 'y',
		                pivot,
		                segments,
		                waypoint,
		                waypointUseMax,
		                envelopingObstacle,
		                secondEnvelopingObstacle,
		                envelopWaypoint,
		                obstacleMargin = options.obstacleOptions.margin,
		                bounds = {
		                    soft: {
		                        xMin: softMinX,
		                        xMax: softMaxX,
		                        yMin: softMinY,
		                        yMax: softMaxY
		                    },
		                    hard: options.hardBounds
		                };

		            // If fromPoint is inside an obstacle we have a problem. Break out
		            // by just going to the outside of this obstacle. We prefer to go to
		            // the nearest edge in the chosen direction.
		            envelopingObstacle =
		                findObstacleFromPoint(chartObstacles, fromPoint);
		            if (envelopingObstacle > -1) {
		                envelopingObstacle = chartObstacles[envelopingObstacle];
		                waypointUseMax = getDodgeDirection(
		                    envelopingObstacle, fromPoint, toPoint, dirIsX, bounds
		                );

		                // Cut obstacle to hard bounds to make sure we stay within
		                limitObstacleToBounds(envelopingObstacle, options.hardBounds);

		                envelopWaypoint = dirIsX ? {
		                    y: fromPoint.y,
		                    x: envelopingObstacle[waypointUseMax ? 'xMax' : 'xMin'] +
		                        (waypointUseMax ? 1 : -1)
		                } : {
		                    x: fromPoint.x,
		                    y: envelopingObstacle[waypointUseMax ? 'yMax' : 'yMin'] +
		                        (waypointUseMax ? 1 : -1)
		                };

		                // If we crashed into another obstacle doing this, we put the
		                // waypoint between them instead
		                secondEnvelopingObstacle = findObstacleFromPoint(
		                    chartObstacles, envelopWaypoint);
		                if (secondEnvelopingObstacle > -1) {
		                    secondEnvelopingObstacle = chartObstacles[
		                        secondEnvelopingObstacle
		                    ];

		                    // Cut obstacle to hard bounds
		                    limitObstacleToBounds(
		                        secondEnvelopingObstacle,
		                        options.hardBounds
		                    );

		                    // Modify waypoint to lay between obstacles
		                    envelopWaypoint[dir] = waypointUseMax ? max(
		                        envelopingObstacle[dir + 'Max'] - obstacleMargin + 1,
		                        (
		                            secondEnvelopingObstacle[dir + 'Min'] +
		                            envelopingObstacle[dir + 'Max']
		                        ) / 2
		                    ) :
		                    min(
		                        envelopingObstacle[dir + 'Min'] + obstacleMargin - 1,
		                        (
		                            secondEnvelopingObstacle[dir + 'Max'] +
		                            envelopingObstacle[dir + 'Min']
		                        ) / 2
		                    );

		                    // We are not going anywhere. If this happens for the first
		                    // time, do nothing. Otherwise, try to go to the extreme of
		                    // the obstacle pair in the current direction.
		                    if (fromPoint.x === envelopWaypoint.x &&
		                        fromPoint.y === envelopWaypoint.y) {
		                        if (forceObstacleBreak) {
		                            envelopWaypoint[dir] = waypointUseMax ?
		                                max(
		                                    envelopingObstacle[dir + 'Max'],
		                                    secondEnvelopingObstacle[dir + 'Max']
		                                ) + 1 :
		                                min(
		                                    envelopingObstacle[dir + 'Min'],
		                                    secondEnvelopingObstacle[dir + 'Min']
		                                ) - 1;
		                        }
		                        // Toggle on if off, and the opposite
		                        forceObstacleBreak = !forceObstacleBreak;
		                    } else {
		                        // This point is not identical to previous.
		                        // Clear break trigger.
		                        forceObstacleBreak = false;
		                    }
		                }

		                segments = [{
		                    start: fromPoint,
		                    end: envelopWaypoint
		                }];

		            } else { // If not enveloping, use standard pivot calculation

		                pivot = pivotPoint(fromPoint, {
		                    x: dirIsX ? toPoint.x : fromPoint.x,
		                    y: dirIsX ? fromPoint.y : toPoint.y
		                }, dirIsX);

		                segments = [{
		                    start: fromPoint,
		                    end: {
		                        x: pivot.x,
		                        y: pivot.y
		                    }
		                }];

		                // Pivot before goal, use a waypoint to dodge obstacle
		                if (pivot[dirIsX ? 'x' : 'y'] !== toPoint[dirIsX ? 'x' : 'y']) {
		                    // Find direction of waypoint
		                    waypointUseMax = getDodgeDirection(
		                        pivot.obstacle, pivot, toPoint, !dirIsX, bounds
		                    );

		                    // Cut waypoint to hard bounds
		                    limitObstacleToBounds(pivot.obstacle, options.hardBounds);

		                    waypoint = {
		                        x: dirIsX ?
		                            pivot.x :
		                            pivot.obstacle[waypointUseMax ? 'xMax' : 'xMin'] +
		                                (waypointUseMax ? 1 : -1),
		                        y: dirIsX ?
		                            pivot.obstacle[waypointUseMax ? 'yMax' : 'yMin'] +
		                                (waypointUseMax ? 1 : -1) :
		                            pivot.y
		                    };

		                    // We're changing direction here, store that to make sure we
		                    // also change direction when adding the last segment array
		                    // after handling waypoint.
		                    dirIsX = !dirIsX;

		                    segments = segments.concat(clearPathTo({
		                        x: pivot.x,
		                        y: pivot.y
		                    }, waypoint, dirIsX));
		                }
		            }

		            // Get segments for the other direction too
		            // Recursion is our friend
		            segments = segments.concat(clearPathTo(
		                segments[segments.length - 1].end, toPoint, !dirIsX
		            ));

		            return segments;
		        }

		        // Extract point to outside of obstacle in whichever direction is
		        // closest. Returns new point outside obstacle.
		        function extractFromObstacle(obstacle, point, goalPoint) {
		            var dirIsX = min(obstacle.xMax - point.x, point.x - obstacle.xMin) <
		                        min(obstacle.yMax - point.y, point.y - obstacle.yMin),
		                bounds = {
		                    soft: options.hardBounds,
		                    hard: options.hardBounds
		                },
		                useMax = getDodgeDirection(
		                    obstacle, point, goalPoint, dirIsX, bounds
		                );

		            return dirIsX ? {
		                y: point.y,
		                x: obstacle[useMax ? 'xMax' : 'xMin'] + (useMax ? 1 : -1)
		            } : {
		                x: point.x,
		                y: obstacle[useMax ? 'yMax' : 'yMin'] + (useMax ? 1 : -1)
		            };
		        }

		        // Cut the obstacle array to soft bounds for optimization in large
		        // datasets.
		        chartObstacles =
		            chartObstacles.slice(startObstacleIx, endObstacleIx + 1);

		        // If an obstacle envelops the end point, move it out of there and add
		        // a little segment to where it was.
		        if ((endObstacleIx = findObstacleFromPoint(chartObstacles, end)) > -1) {
		            extractedEndPoint = extractFromObstacle(
		                chartObstacles[endObstacleIx],
		                end,
		                start
		            );
		            endSegments.push({
		                end: end,
		                start: extractedEndPoint
		            });
		            end = extractedEndPoint;
		        }
		        // If it's still inside one or more obstacles, get out of there by
		        // force-moving towards the start point.
		        while (
		            (endObstacleIx = findObstacleFromPoint(chartObstacles, end)) > -1
		        ) {
		            useMax = end[dir] - start[dir] < 0;
		            extractedEndPoint = {
		                x: end.x,
		                y: end.y
		            };
		            extractedEndPoint[dir] = chartObstacles[endObstacleIx][
		                useMax ? dir + 'Max' : dir + 'Min'
		            ] + (useMax ? 1 : -1);
		            endSegments.push({
		                end: end,
		                start: extractedEndPoint
		            });
		            end = extractedEndPoint;
		        }

		        // Find the path
		        segments = clearPathTo(start, end, dirIsX);

		        // Add the end-point segments
		        segments = segments.concat(endSegments.reverse());

		        return {
		            path: pathFromSegments(segments),
		            obstacles: segments
		        };
		    }, {
		        requiresObstacles: true
		    })
		};


		return algorithms;
	}(Highcharts));
	(function (H) {
		/**
		 * (c) 2017 Highsoft AS
		 * Authors: Lars A. V. Cabrera
		 *
		 * License: www.highcharts.com/license
		 */

		/**
		 * Creates an arrow symbol. Like a triangle, except not filled.
		 *                   o
		 *             o
		 *       o
		 * o
		 *       o
		 *             o
		 *                   o
		 * @param  {number} x x position of the arrow
		 * @param  {number} y y position of the arrow
		 * @param  {number} w width of the arrow
		 * @param  {number} h height of the arrow
		 * @return {Array}   Path array
		 */
		H.SVGRenderer.prototype.symbols.arrow = function (x, y, w, h) {
		    return [
		        'M', x, y + h / 2,
		        'L', x + w, y,
		        'L', x, y + h / 2,
		        'L', x + w, y + h
		    ];
		};

		/**
		 * Creates a half-width arrow symbol. Like a triangle, except not filled.
		 *       o
		 *    o
		 * o
		 *    o
		 *       o
		 * @param  {number} x x position of the arrow
		 * @param  {number} y y position of the arrow
		 * @param  {number} w width of the arrow
		 * @param  {number} h height of the arrow
		 * @return {Array}   Path array
		 */
		H.SVGRenderer.prototype.symbols['arrow-half'] = function (x, y, w, h) {
		    return H.SVGRenderer.prototype.symbols.arrow(x, y, w / 2, h);
		};

		/**
		 * Creates a left-oriented triangle.
		 *             o
		 *       ooooooo
		 * ooooooooooooo
		 *       ooooooo
		 *             o
		 * @param  {number} x x position of the triangle
		 * @param  {number} y y position of the triangle
		 * @param  {number} w width of the triangle
		 * @param  {number} h height of the triangle
		 * @return {Array}   Path array
		 */
		H.SVGRenderer.prototype.symbols['triangle-left'] = function (x, y, w, h) {
		    return [
		        'M', x + w, y,
		        'L', x, y + h / 2,
		        'L', x + w, y + h,
		        'Z'
		    ];
		};

		/**
		 * Alias function for triangle-left.
		 * @param  {number} x x position of the arrow
		 * @param  {number} y y position of the arrow
		 * @param  {number} w width of the arrow
		 * @param  {number} h height of the arrow
		 * @return {Array}   Path array
		 */
		H.SVGRenderer.prototype.symbols['arrow-filled'] =
		        H.SVGRenderer.prototype.symbols['triangle-left'];

		/**
		 * Creates a half-width, left-oriented triangle.
		 *       o
		 *    oooo
		 * ooooooo
		 *    oooo
		 *       o
		 * @param  {number} x x position of the triangle
		 * @param  {number} y y position of the triangle
		 * @param  {number} w width of the triangle
		 * @param  {number} h height of the triangle
		 * @return {Array}   Path array
		 */
		H.SVGRenderer.prototype.symbols['triangle-left-half'] = function (x, y, w, h) {
		    return H.SVGRenderer.prototype.symbols['triangle-left'](x, y, w / 2, h);
		};

		/**
		 * Alias function for triangle-left-half.
		 * @param  {number} x x position of the arrow
		 * @param  {number} y y position of the arrow
		 * @param  {number} w width of the arrow
		 * @param  {number} h height of the arrow
		 * @return {Array}   Path array
		 */
		H.SVGRenderer.prototype.symbols['arrow-filled-half'] =
		        H.SVGRenderer.prototype.symbols['triangle-left-half'];

	}(Highcharts));
	(function (H, pathfinderAlgorithms) {
		/**
		 * (c) 2016 Highsoft AS
		 * Authors: Øystein Moseng, Lars A. V. Cabrera
		 *
		 * License: www.highcharts.com/license
		 */

		var defined = H.defined,
		    deg2rad = H.deg2rad,
		    extend = H.extend,
		    each = H.each,
		    addEvent = H.addEvent,
		    merge = H.merge,
		    pick = H.pick,
		    max = Math.max,
		    min = Math.min;

		/*
		 TODO:
		     - Test dynamics, hiding/adding/removing/updating chart/series/points/axes
		     - Test connecting to multiple points
		     - Add demos/samples
		     - Document how to write your own algorithms
		     - Consider adding a Point.pathTo method that wraps creating a connection
		       and rendering it
		*/


		// Set default Pathfinder options
		extend(H.defaultOptions, {
		    /**
		     * The Pathfinder allows you to define connections between any two points,
		     * represented as lines - optionally with markers for the start and/or end
		     * points. Multiple algorithms are available for calculating how the
		     * connecting lines are drawn.
		     *
		     * Pathfinder functionality requires Highcharts Gantt to be loaded. In Gantt
		     * charts, the Pathfinder is used to draw dependencies between tasks.
		     *
		     * @product gantt
		     * @see [dependency](series.gantt.data.dependency)
		     * @optionparent pathfinder
		     */
		    pathfinder: {
		        /**
		         * Enable the pathfinder for this chart. Requires Highcharts Gantt.
		         *
		         * @type {boolean}
		         * @default true
		         * @since 6.2.0
		         * @apioption pathfinder.enabled
		         */

		        /**
		         * Set the default dash style for this chart's Pathfinder connecting
		         * lines.
		         *
		         * @type {string}
		         * @default solid
		         * @since 6.2.0
		         * @apioption pathfinder.dashStyle
		         */

		        /**
		         * Set the default color for this chart's Pathfinder connecting lines.
		         * Defaults to the color of the point being connected.
		         *
		         * @type {Color}
		         * @default null
		         * @since 6.2.0
		         * @apioption pathfinder.lineColor
		         */

		        /**
		         * Set the default pathfinder margin to use, in pixels. Some Pathfinder
		         * algorithms attempt to avoid obstacles, such as other points in the
		         * chart. These algorithms use this margin to determine how close lines
		         * can be to an obstacle. The default is to compute this automatically
		         * from the size of the obstacles in the chart.
		         *
		         * To draw connecting lines close to existing points, set this to a low
		         * number. For more space around existing points, set this number
		         * higher.
		         *
		         * @type {number}
		         * @default null
		         * @since 6.2.0
		         * @apioption pathfinder.algorithmMargin
		         */

		        /**
		         * Set the default pathfinder algorithm to use for this chart. It is
		         * possible to define your own algorithms by adding them to the
		         * Highcharts.Pathfinder.prototype.algorithms object after the chart
		         * has been created.
		         *
		         * The default algorithms are as follows:
		         *
		         * straight:        Draws a straight line between the connecting points.
		         *                  Does not avoid other points when drawing.
		         *
		         * simpleConnect:   Finds a path between the points using right angles
		         *                  only. Takes only starting/ending points into
		         *                  account, and will not avoid other points.
		         *
		         * fastAvoid:       Finds a path between the points using right angles
		         *                  only. Will attempt to avoid other points, but its
		         *                  focus is performance over accuracy. Works well with
		         *                  less dense datasets.
		         *
		         * @type {string}
		         * @default straight
		         * @since 6.2.0
		         * @apioption pathfinder.type
		         */
		        type: 'straight',

		        /**
		         * Set the default pixel width for this chart's Pathfinder connecting
		         * lines.
		         *
		         * @type {number}
		         * @default 1
		         * @since 6.2.0
		         * @apioption pathfinder.lineWidth
		         */
		        lineWidth: 1,

		        /**
		         * Marker options for this chart's Pathfinder connectors.
		         *
		         * @type {object}
		         * @since 6.2.0
		         * @apioption pathfinder.marker
		         */
		        marker: {
		            /**
		             * Set the radius of the pathfinder markers. The default is
		             * automatically computed based on the algorithmMargin setting.
		             *
		             * Setting marker.width and marker.height will override this
		             * setting.
		             *
		             * @type {number}
		             * @default null
		             * @since 6.2.0
		             * @apioption pathfinder.marker.radius
		             */

		            /**
		             * Set the width of the pathfinder markers. If not supplied, this
		             * is inferred from the marker radius.
		             *
		             * @type {number}
		             * @default null
		             * @since 6.2.0
		             * @apioption pathfinder.marker.width
		             */

		            /**
		             * Set the height of the pathfinder markers. If not supplied, this
		             * is inferred from the marker radius.
		             *
		             * @type {number}
		             * @default null
		             * @since 6.2.0
		             * @apioption pathfinder.marker.height
		             */

		            /**
		             * Set the color of the pathfinder markers. By default this is the
		             * same as the connector color.
		             *
		             * @type {Color}
		             * @default null
		             * @since 6.2.0
		             * @apioption pathfinder.marker.color
		             */

		            /**
		             * Set the line/border color of the pathfinder markers. By default
		             * this is the same as the marker color.
		             *
		             * @type {Color}
		             * @default null
		             * @since 6.2.0
		             * @apioption pathfinder.marker.lineColor
		             */

		            /**
		             * Enable markers for the connectors.
		             */
		            enabled: false,

		            /**
		             * Horizontal alignment of the markers relative to the points.
		             */
		            align: 'center',

		            /**
		             * Vertical alignment of the markers relative to the points.
		             */
		            verticalAlign: 'middle',

		            /**
		             * Whether or not to draw the markers inside the points.
		             */
		            inside: false,

		            /**
		             * Set the line/border width of the pathfinder markers.
		             */
		            lineWidth: 1
		        },

		        /**
		         * Marker options specific to the start markers for this chart's
		         * Pathfinder connectors. Overrides the generic marker options.
		         *
		         * @type {object}
		         * @since 6.2.0
		         * @extends pathfinder.marker
		         * @apioption pathfinder.startMarker
		         */
		        startMarker: {
		            /**
		             * Set the symbol of the pathfinder start markers.
		             */
		            symbol: 'diamond'
		        },

		        /**
		         * Marker options specific to the end markers for this chart's
		         * Pathfinder connectors. Overrides the generic marker options.
		         *
		         * @type {object}
		         * @since 6.2.0
		         * @extends pathfinder.marker
		         * @apioption pathfinder.endMarker
		         */
		        endMarker: {
		            /**
		             * Set the symbol of the pathfinder end markers.
		             */
		            symbol: 'arrow-filled'
		        }
		    }
		});

		/**
		 * Override Pathfinder options for a series. Requires Highcharts Gantt or the
		 * Pathfinder module.
		 *
		 * @since 6.2.0
		 * @extends pathfinder
		 * @product gantt
		 * @apioption plotOptions.series.pathfinder
		 * @excluding enabled,algorithmMargin
		 */

		/**
		 * Connect to a point. Requires Highcharts Gantt to be loaded. This option can
		 * be either a string, referring to the ID of another point, or an object.
		 *
		 * @type {string|object}
		 * @since 6.2.0
		 * @extends plotOptions.series.pathfinder
		 * @product gantt
		 * @apioption series.xrange.data.connect
		 */

		/**
		 * The ID of the point to connect to.
		 *
		 * @type {string}
		 * @since 6.2.0
		 * @product gantt
		 * @apioption series.xrange.data.connect.to
		 */


		/**
		 * Get point bounding box using plotX/plotY and shapeArgs. If using
		 * graphic.getBBox() directly, the bbox will be affected by animation.
		 *
		 * @param   {Highcharts.Point} point
		 *          The point to get BB of.
		 *
		 * @return  {object}
		 *          Result xMax, xMin, yMax, yMin.
		 */
		function getPointBB(point) {
		    var shapeArgs = point.shapeArgs,
		        bb;

		    // Prefer using shapeArgs (columns)
		    if (shapeArgs) {
		        return {
		            xMin: shapeArgs.x,
		            xMax: shapeArgs.x + shapeArgs.width,
		            yMin: shapeArgs.y,
		            yMax: shapeArgs.y + shapeArgs.height
		        };
		    }

		    // Otherwise use plotX/plotY and bb
		    bb = point.graphic && point.graphic.getBBox();
		    return bb ? {
		        xMin: point.plotX - bb.width / 2,
		        xMax: point.plotX + bb.width / 2,
		        yMin: point.plotY - bb.height / 2,
		        yMax: point.plotY + bb.height / 2
		    } : null;
		}


		/**
		 * Calculate margin to place around obstacles for the pathfinder in pixels.
		 * Returns a minimum of 1 pixel margin.
		 *
		 * @param   {Array} obstacles
		 *          Obstacles to calculate margin from.
		 *
		 * @return  {number}
		 *          The calculated margin in pixels. At least 1.
		 */
		function calculateObstacleMargin(obstacles) {
		    var len = obstacles.length,
		        i = 0,
		        j,
		        obstacleDistance,
		        distances = [],
		        // Compute smallest distance between two rectangles
		        distance = function (a, b, bbMargin) {
		            // Count the distance even if we are slightly off
		            var margin = pick(bbMargin, 10),
		                yOverlap = a.yMax + margin > b.yMin - margin &&
		                            a.yMin - margin < b.yMax + margin,
		                xOverlap = a.xMax + margin > b.xMin - margin &&
		                            a.xMin - margin < b.xMax + margin,
		                xDistance = yOverlap ? (
		                    a.xMin > b.xMax ? a.xMin - b.xMax : b.xMin - a.xMax
		                ) : Infinity,
		                yDistance = xOverlap ? (
		                    a.yMin > b.yMax ? a.yMin - b.yMax : b.yMin - a.yMax
		                ) : Infinity;

		            // If the rectangles collide, try recomputing with smaller margin.
		            // If they collide anyway, discard the obstacle.
		            if (xOverlap && yOverlap) {
		                return (
		                    margin ?
		                    distance(a, b, Math.floor(margin / 2)) :
		                    Infinity
		                );
		            }

		            return min(xDistance, yDistance);
		        };

		    // Go over all obstacles and compare them to the others.
		    for (; i < len; ++i) {
		        // Compare to all obstacles ahead. We will already have compared this
		        // obstacle to the ones before.
		        for (j = i + 1; j < len; ++j) {
		            obstacleDistance = distance(obstacles[i], obstacles[j]);
		            // TODO: Magic number 80
		            if (obstacleDistance < 80) { // Ignore large distances
		                distances.push(obstacleDistance);
		            }
		        }
		    }
		    // Ensure we always have at least one value, even in very spaceous charts
		    distances.push(80);

		    return max(
		        Math.floor(
		            distances.sort(function (a, b) {
		                return a - b;
		            })[
		                // Discard first 10% of the relevant distances, and then grab
		                // the smallest one.
		                Math.floor(distances.length / 10)
		            ] / 2 - 1 // Divide the distance by 2 and subtract 1.
		        ),
		        1 // 1 is the minimum margin
		    );
		}


		/**
		 * The Connection class. Used internally to represent a connection between two
		 * points.
		 *
		 * @private
		 * @class Connection
		 *
		 * @param   {Highcharts.Point} from
		 *          Connection runs from this Point.
		 *
		 * @param   {Highcharts.Point} to
		 *          Connection runs to this Point.
		 *
		 * @param   {object} [options]
		 *          Connection options.
		 */
		function Connection(from, to, options) {
		    this.init(from, to, options);
		}
		Connection.prototype = {

		    /**
		     * Initialize the Connection object. Used as constructor only.
		     *
		     * @function Highcharts.Connection#init
		     *
		     * @param   {Highcharts.Point} from
		     *          Connection runs from this Point.
		     *
		     * @param   {Highcharts.Point} to
		     *          Connection runs to this Point.
		     *
		     * @param   {object} [options]
		     *          Connection options.
		     *
		     * @return  {void}
		     */
		    init: function (from, to, options) {
		        this.fromPoint = from;
		        this.toPoint = to;
		        this.options = options;
		        this.chart = from.series.chart;
		        this.pathfinder = this.chart.pathfinder;
		    },

		    /**
		     * Add (or update) this connection's path on chart. Stores reference to the
		     * created element on this.graphics.path.
		     *
		     * @function Highcharts.Connection#renderPath
		     *
		     * @param   {Array} path
		     *          Path to render, in array format. E.g. ['M', 0, 0, 'L', 10, 10]
		     *
		     * @param   {object} [attribs]
		     *          SVG attributes for the path.
		     *
		     * @param   {object} [animation]
		     *          Animation options for the rendering.
		     *
		     * @param   {Function} [complete]
		     *          Callback function when the path has been rendered and animation
		     *          is complete.
		     *
		     * @return  {void}
		     */
		    renderPath: function (path, attribs, animation) {
		        var connection = this,
		            chart = this.chart,
		            pathfinder = chart.pathfinder,
		            animate = !chart.options.chart.forExport && animation !== false,
		            pathGraphic = connection.graphics && connection.graphics.path;

		        // Add the SVG element of the pathfinder group if it doesn't exist
		        if (!pathfinder.group) {
		            pathfinder.group = chart.renderer.g()
		                .addClass('highcharts-pathfinder-group')
		                .attr({ zIndex: -1 })
		                .add(chart.seriesGroup);
		        }

		        // Shift the group to compensate for plot area.
		        // Note: Do this always (even when redrawing a path) to avoid issues
		        // when updating chart in a way that changes plot metrics.
		        pathfinder.group.translate(chart.plotLeft, chart.plotTop);

		        // Create path if does not exist
		        if (!(pathGraphic && pathGraphic.renderer)) {
		            pathGraphic = chart.renderer.path()
                
		                .add(pathfinder.group);
		        }

		        // Set path attribs and animate to the new path
		        pathGraphic.attr(attribs);
		        pathGraphic[animate ? 'animate' : 'attr']({
            
		            d: path
		        }, animation);

		        // Store reference on connection
		        this.graphics = this.graphics || {};
		        this.graphics.path = pathGraphic;
		    },

		    /**
		     * Calculate and add marker graphics for connection to the chart. The
		     * created/updated elements are stored on this.graphics.start and
		     * this.graphics.end.
		     *
		     * @function Highcharts.Connection#addMarker
		     *
		     * @param   {string} type
		     *          Marker type, either 'start' or 'end'.
		     *
		     * @param   {object} options
		     *          All options for this marker. Not calculated or merged with other
		     *          options.
		     *
		     * @param   {Array} path
		     *          Connection path in array format. This is used to calculate the
		     *          rotation angle of the markers.
		     *
		     * @return  {void}
		     */
		    addMarker: function (type, options, path) {
		        var connection = this,
		            chart = connection.fromPoint.series.chart,
		            pathfinder = chart.pathfinder,
		            renderer = chart.renderer,
		            point = (
		                type === 'start' ?
		                connection.fromPoint :
		                connection.toPoint
		            ),
		            anchor = point.getPathfinderAnchorPoint(options),
		            markerVector,
		            radians,
		            rotation,
		            box,
		            width,
		            height,
		            pathVector;


		        if (!options.enabled) {
		            return;
		        }

		        // Last vector before start/end of path, used to get angle
		        if (type === 'start') {
		            pathVector = {
		                x: path[4],
		                y: path[5]
		            };
		        } else { // 'end'
		            pathVector = {
		                x: path[path.length - 5],
		                y: path[path.length - 4]
		            };
		        }

		        // Get angle between pathVector and anchor point and use it to create
		        // marker position.
		        radians = point.getRadiansToVector(pathVector, anchor);
		        markerVector = point.getMarkerVector(
		            radians,
		            options.radius,
		            anchor
		        );

		        // Rotation of marker is calculated from angle between pathVector and
		        // markerVector.
		        // (Note:
		        //  Used to recalculate radians between markerVector and pathVector,
		        //  but this should be the same as between pathVector and anchor.)
		        rotation = -radians / deg2rad;

		        if (options.width && options.height) {
		            width = options.width;
		            height = options.height;
		        } else {
		            width = height = options.radius * 2;
		        }

		        // Add graphics object if it does not exist
		        connection.graphics = connection.graphics || {};
		        box = {
		            x: markerVector.x - (width / 2),
		            y: markerVector.y - (height / 2),
		            width: width,
		            height: height,
		            rotation: rotation,
		            rotationOriginX: markerVector.x,
		            rotationOriginY: markerVector.y
		        };

		        if (!connection.graphics[type]) {

		            // Create new marker element
		            connection.graphics[type] = renderer.symbol(
		                    options.symbol
		                )
		                .addClass(
		                    'highcharts-point-connecting-path-' + type + '-marker'
		                )
		                .attr(box)

                
		                .add(pathfinder.group);
		        } else {
		            connection.graphics[type].animate(box);
		        }
		    },

		    /**
		     * Calculate and return connection path.
		     * Note: Recalculates chart obstacles on demand if they aren't calculated.
		     *
		     * @function Highcharts.Connection#getPath
		     *
		     * @param   {object} options
		     *          Pathfinder options. Not calculated or merged with other options.
		     *
		     * @return  {Array}
		     *          Calculated SVG path data in array format.
		     */
		    getPath: function (options) {
		        var pathfinder = this.pathfinder,
		            chart = this.chart,
		            algorithm = pathfinder.algorithms[options.type],
		            chartObstacles = pathfinder.chartObstacles;

		        if (typeof algorithm !== 'function') {
		            H.error(
		                '"' + options.type + '" is not a Pathfinder algorithm.'
		            );
		            return;
		        }

		        // This function calculates obstacles on demand if they don't exist
		        if (algorithm.requiresObstacles && !chartObstacles) {
		            chartObstacles =
		                pathfinder.chartObstacles =
		                pathfinder.getChartObstacles(options);

		            // If the algorithmMargin was computed, store the result in default
		            // options.
		            chart.options.pathfinder.algorithmMargin = options.algorithmMargin;

		            // Cache some metrics too
		            pathfinder.chartObstacleMetrics =
		                pathfinder.getObstacleMetrics(chartObstacles);
		        }

		        // Get the SVG path
		        return algorithm(
		            // From
		            this.fromPoint.getPathfinderAnchorPoint(options.startMarker),
		            // To
		            this.toPoint.getPathfinderAnchorPoint(options.endMarker),
		            merge({
		                chartObstacles: chartObstacles,
		                lineObstacles: pathfinder.lineObstacles || [],
		                obstacleMetrics: pathfinder.chartObstacleMetrics,
		                hardBounds: {
		                    xMin: 0,
		                    xMax: chart.plotWidth,
		                    yMin: 0,
		                    yMax: chart.plotHeight
		                },
		                obstacleOptions: {
		                    margin: options.algorithmMargin
		                },
		                startDirectionX: pathfinder.getAlgorithmStartDirection(
		                                options.startMarker
		                            )
		            }, options)
		        );
		    },

		    /**
		     * (re)Calculate and (re)draw the connection.
		     *
		     * @function Highcharts.Connection#render
		     */
		    render: function () {
		        var connection = this,
		            fromPoint = connection.fromPoint,
		            series = fromPoint.series,
		            chart = series.chart,
		            pathfinder = chart.pathfinder,
		            pathResult,
		            path,
		            options = merge(
		                chart.options.pathfinder, series.options.pathfinder,
		                fromPoint.options.pathfinder, connection.options
		            ),
		            attribs = {};

		        // Set path attribs
        

		        attribs.class = 'highcharts-point-connecting-path ' +
		            'highcharts-color-' + fromPoint.colorIndex;
		        options = merge(attribs, options);

		        // Set common marker options
		        if (!defined(options.marker.radius)) {
		            options.marker.radius = min(max(
		                Math.ceil((options.algorithmMargin || 8) / 2) - 1, 1
		            ), 5);
		        }
		        // Get the path
		        pathResult = connection.getPath(options);
		        path = pathResult.path;

		        // Always update obstacle storage with obstacles from this path.
		        // We don't know if future calls will need this for their algorithm.
		        if (pathResult.obstacles) {
		            pathfinder.lineObstacles = pathfinder.lineObstacles || [];
		            pathfinder.lineObstacles =
		                pathfinder.lineObstacles.concat(pathResult.obstacles);
		        }

		        // Add the calculated path to the pathfinder group
		        connection.renderPath(path, attribs, series.options.animation);

		        // Render the markers
		        connection.addMarker(
		            'start',
		            merge(options.marker, options.startMarker),
		            path
		        );
		        connection.addMarker(
		            'end',
		            merge(options.marker, options.endMarker),
		            path
		        );
		    },

		    /**
		     * Destroy connection by destroying the added graphics elements.
		     *
		     * @function Highcharts.Connection#destroy
		     */
		    destroy: function () {
		        if (this.graphics) {
		            H.objectEach(this.graphics, function (val) {
		                val.destroy();
		            });
		            delete this.graphics;
		        }
		    }
		};


		/**
		 * The Pathfinder class.
		 *
		 * @private
		 * @class Pathfinder
		 *
		 * @param   {Highcharts.Chart} chart
		 *          The chart to operate on.
		 */
		function Pathfinder(chart) {
		    this.init(chart);
		}
		Pathfinder.prototype = {

		    algorithms: pathfinderAlgorithms,

		    /**
		     * Initialize the Pathfinder object.
		     *
		     * @function Highcharts.Pathfinder#init
		     *
		     * @param   {Highcharts.Chart} chart
		     *          The chart context.
		     *
		     * @return  {void}
		     */
		    init: function (chart) {
		        // Initialize pathfinder with chart context
		        this.chart = chart;

		        // Init connection reference list
		        this.connections = [];

		        // Recalculate paths/obstacles on chart redraw
		        addEvent(chart, 'redraw', function () {
		            this.pathfinder.update();
		        });
		    },

		    /**
		     * Update Pathfinder connections from scratch.
		     *
		     * @function Highcharts.Pathfinder#update
		     *
		     * @param {boolean} deferRender Whether or not to defer rendering of
		     *      connections until series.afterAnimate event has fired. Used on first
		     *      render.
		     */
		    update: function (deferRender) {
		        var chart = this.chart,
		            pathfinder = this,
		            oldConnections = pathfinder.connections;

		        // Rebuild pathfinder connections from options
		        pathfinder.connections = [];
		        each(chart.series, function (series) {
		            if (series.visible) {
		                each(series.points, function (point) {
		                    var to,
		                        connects = (
		                            point.options &&
		                            point.options.connect &&
		                            H.splat(point.options.connect)
		                        );
		                    if (point.visible && point.isInside !== false && connects) {
		                        each(connects, function (connect) {
		                            to = chart.get(typeof connect === 'string' ?
		                                connect : connect.to
		                            );
		                            if (
		                                to instanceof H.Point &&
		                                to.series.visible &&
		                                to.visible &&
		                                to.isInside !== false
		                            ) {
		                                // Add new connection
		                                pathfinder.connections.push(new Connection(
		                                    point, // from
		                                    to,
		                                    typeof connect === 'string' ? {} : connect
		                                ));
		                            }
		                        });
		                    }
		                });
		            }
		        });

		        // Clear connections that should not be updated, and move old info over
		        // to new connections.
		        for (
		            var j = 0, k, found, lenOld = oldConnections.length,
		                lenNew = pathfinder.connections.length;
		            j < lenOld;
		            ++j
		        ) {
		            found = false;
		            for (k = 0; k < lenNew; ++k) {
		                if (
		                    oldConnections[j].fromPoint ===
		                        pathfinder.connections[k].fromPoint &&
		                    oldConnections[j].toPoint ===
		                        pathfinder.connections[k].toPoint
		                ) {
		                    pathfinder.connections[k].graphics =
		                        oldConnections[j].graphics;
		                    found = true;
		                    break;
		                }
		            }
		            if (!found) {
		                oldConnections[j].destroy();
		            }
		        }

		        // Clear obstacles to force recalculation. This must be done on every
		        // redraw in case positions have changed. Recalculation is handled in
		        // Connection.getPath on demand.
		        delete this.chartObstacles;
		        delete this.lineObstacles;

		        // Draw the pending connections
		        pathfinder.renderConnections(deferRender);
		    },

		    /**
		     * Draw the chart's connecting paths.
		     *
		     * @function Highcharts.Pathfinder#renderConnections
		     *
		     * @param {boolean} deferRender Whether or not to defer render until series
		     *      animation is finished. Used on first render.
		     */
		    renderConnections: function (deferRender) {
		        if (deferRender) {
		            // Render after series are done animating
		            each(this.chart.series, function (series) {
		                var render = function () {
		                    // Find pathfinder connections belonging to this series
		                    // that haven't rendered, and render them now.
		                    var pathfinder = series.chart.pathfinder,
		                        conns = pathfinder && pathfinder.connections || [];
		                    each(conns, function (connection) {
		                        if (
		                            connection.fromPoint &&
		                            connection.fromPoint.series === series
		                        ) {
		                            connection.render();
		                        }
		                    });
		                    if (series.pathfinderRemoveRenderEvent) {
		                        series.pathfinderRemoveRenderEvent();
		                        delete series.pathfinderRemoveRenderEvent;
		                    }
		                };
		                if (series.options.animation === false) {
		                    render();
		                } else {
		                    series.pathfinderRemoveRenderEvent = addEvent(
		                        series, 'afterAnimate', render
		                    );
		                }
		            });
		        } else {
		            // Go through connections and render them
		            each(this.connections, function (connection) {
		                connection.render();
		            });
		        }
		    },

		    /**
		     * Get obstacles for the points in the chart. Does not include connecting
		     * lines from Pathfinder. Applies algorithmMargin to the obstacles.
		     *
		     * @function Highcharts.Pathfinder#getChartObstacles
		     *
		     * @param   {object} options
		     *          Options for the calculation. Currenlty only
		     *          options.algorithmMargin.
		     *
		     * @return  {Array}
		     *          An array of calculated obstacles. Each obstacle is defined as
		     *          an object with xMin, xMax, yMin and yMax properties.
		     */
		    getChartObstacles: function (options) {
		        var obstacles = [],
		            series = this.chart.series,
		            margin = pick(options.algorithmMargin, 0),
		            calculatedMargin;
		        for (var i = 0, sLen = series.length; i < sLen; ++i) {
		            if (series[i].visible) {
		                for (
		                    var j = 0, pLen = series[i].points.length, bb, point;
		                    j < pLen;
		                    ++j
		                ) {
		                    point = series[i].points[j];
		                    if (point.visible) {
		                        bb = getPointBB(point);
		                        if (bb) {
		                            obstacles.push({
		                                xMin: bb.xMin - margin,
		                                xMax: bb.xMax + margin,
		                                yMin: bb.yMin - margin,
		                                yMax: bb.yMax + margin
		                            });
		                        }
		                    }
		                }
		            }
		        }

		        // Sort obstacles by xMin for optimization
		        obstacles = obstacles.sort(function (a, b) {
		            return a.xMin - b.xMin;
		        });

		        // Add auto-calculated margin if the option is not defined
		        if (!defined(options.algorithmMargin)) {
		            calculatedMargin =
		                options.algorithmMargin =
		                calculateObstacleMargin(obstacles);
		            each(obstacles, function (obstacle) {
		                obstacle.xMin -= calculatedMargin;
		                obstacle.xMax += calculatedMargin;
		                obstacle.yMin -= calculatedMargin;
		                obstacle.yMax += calculatedMargin;
		            });
		        }

		        return obstacles;
		    },

		    /**
		     * Utility function to get metrics for obstacles:
		     *  - Widest obstacle width
		     *  - Tallest obstacle height
		     *
		     * @function Highcharts.Pathfinder#getObstacleMetrics
		     *
		     * @param   {Array} obstacles
		     *          An array of obstacles to inspect.
		     *
		     * @return  {object}
		     *          The calculated metrics, as an object with maxHeight and maxWidth
		     *          properties.
		     */
		    getObstacleMetrics: function (obstacles) {
		        var maxWidth = 0,
		            maxHeight = 0,
		            width,
		            height,
		            i = obstacles.length;

		        while (i--) {
		            width = obstacles[i].xMax - obstacles[i].xMin;
		            height = obstacles[i].yMax - obstacles[i].yMin;
		            if (maxWidth < width) {
		                maxWidth = width;
		            }
		            if (maxHeight < height) {
		                maxHeight = height;
		            }
		        }

		        return {
		            maxHeight: maxHeight,
		            maxWidth: maxWidth
		        };
		    },

		    /**
		     * Utility to get which direction to start the pathfinding algorithm
		     * (X vs Y), calculated from a set of marker options.
		     *
		     * @function Highcharts.Pathfinder#getAlgorithmStartDirection
		     *
		     * @param   {object} markerOptions
		     *          Marker options to calculate from.
		     *
		     * @return  {boolean}
		     *          Returns true for X, false for Y, and undefined for
		     *          autocalculate.
		     */
		    getAlgorithmStartDirection: function (markerOptions) {
		        var xCenter = markerOptions.align !== 'left' &&
		                        markerOptions.align !== 'right',
		            yCenter = markerOptions.verticalAlign !== 'top' &&
		                        markerOptions.verticalAlign !== 'bottom',
		            undef;

		        return xCenter ?
		            (yCenter ? undef : false) : // x is centered
		            (yCenter ? true : undef);   // x is off-center
		    }
		};

		// Add to Highcharts namespace
		H.Connection = Connection;
		H.Pathfinder = Pathfinder;


		// Add pathfinding capabilities to Points
		extend(H.Point.prototype, /** @lends Point.prototype */ {

		    /**
		     * Get coordinates of anchor point for pathfinder connection.
		     *
		     * @private
		     * @function Highcharts.Point#getPathfinderAnchorPoint
		     *
		     * @param   {object} markerOptions
		     *          Connection options for position on point.
		     *
		     * @return  {object}
		     *          An object with x/y properties for the position. Coordinates are
		     *          in plot values, not relative to point.
		     */
		    getPathfinderAnchorPoint: function (markerOptions) {
		        var bb = getPointBB(this),
		            x,
		            y;

		        switch (markerOptions.align) { // eslint-disable-line default-case
		            case 'right':
		                x = 'xMax';
		                break;
		            case 'left':
		                x = 'xMin';
		        }

		        switch (markerOptions.verticalAlign) { // eslint-disable-line default-case
		            case 'top':
		                y = 'yMin';
		                break;
		            case 'bottom':
		                y = 'yMax';
		        }

		        return {
		            x: x ? bb[x] : (bb.xMin + bb.xMax) / 2,
		            y: y ? bb[y] : (bb.yMin + bb.yMax) / 2
		        };
		    },

		    /**
		     * Utility to get the angle from one point to another.
		     *
		     * @private
		     * @function Highcharts.Point#getRadiansToVector
		     *
		     * @param   {object} v1
		     *          The first vector, as an object with x/y properties.
		     *
		     * @param   {object} v2
		     *          The second vector, as an object with x/y properties.
		     *
		     * @return  {number}
		     *          The angle in degrees
		     */
		    getRadiansToVector: function (v1, v2) {
		        var box;
		        if (!defined(v2)) {
		            box = getPointBB(this);
		            v2 = {
		                x: (box.xMin + box.xMax) / 2,
		                y: (box.yMin + box.yMax) / 2
		            };
		        }
		        return Math.atan2(v2.y - v1.y, v1.x - v2.x);
		    },

		    /**
		     * Utility to get the position of the marker, based on the path angle and
		     * the marker's radius.
		     *
		     * @private
		     * @function Highcharts.Point#getMarkerVector
		     *
		     * @param   {number} radians
		     *          The angle in radians from the point center to another vector.
		     *
		     * @param   {number} markerRadius
		     *          The radius of the marker, to calculate the additional distance
		     *          to the center of the marker.
		     *
		     * @param   {object} anchor
		     *          The anchor point of the path and marker as an object with x/y
		     *          properties.
		     *
		     * @return  {object}
		     *          The marker vector as an object with x/y properties.
		     */
		    getMarkerVector: function (radians, markerRadius, anchor) {
		        var twoPI = Math.PI * 2.0,
		            theta = radians,
		            bb = getPointBB(this),
		            rectWidth = bb.xMax - bb.xMin,
		            rectHeight = bb.yMax - bb.yMin,
		            rAtan = Math.atan2(rectHeight, rectWidth),
		            tanTheta = 1,
		            leftOrRightRegion = false,
		            rectHalfWidth = rectWidth / 2.0,
		            rectHalfHeight = rectHeight / 2.0,
		            rectHorizontalCenter = bb.xMin + rectHalfWidth,
		            rectVerticalCenter = bb.yMin + rectHalfHeight,
		            edgePoint = {
		                x: rectHorizontalCenter,
		                y: rectVerticalCenter
		            },
		            markerPoint = {},
		            xFactor = 1,
		            yFactor = 1;

		        while (theta < -Math.PI) {
		            theta += twoPI;
		        }

		        while (theta > Math.PI) {
		            theta -= twoPI;
		        }

		        tanTheta = Math.tan(theta);

		        if ((theta > -rAtan) && (theta <= rAtan)) {
		            // Right side
		            yFactor = -1;
		            leftOrRightRegion = true;
		        } else if (theta > rAtan && theta <= (Math.PI - rAtan)) {
		            // Top side
		            yFactor = -1;
		        } else if (theta > (Math.PI - rAtan) || theta <= -(Math.PI - rAtan)) {
		            // Left side
		            xFactor = -1;
		            leftOrRightRegion = true;
		        } else {
		            // Bottom side
		            xFactor = -1;
		        }

		        // Correct the edgePoint according to the placement of the marker
		        if (leftOrRightRegion) {
		            edgePoint.x += xFactor * (rectHalfWidth);
		            edgePoint.y += yFactor * (rectHalfWidth) * tanTheta;
		        } else {
		            edgePoint.x += xFactor * (rectHeight / (2.0 * tanTheta));
		            edgePoint.y += yFactor * (rectHalfHeight);
		        }

		        if (anchor.x !== rectHorizontalCenter) {
		            edgePoint.x = anchor.x;
		        }
		        if (anchor.y !== rectVerticalCenter) {
		            edgePoint.y = anchor.y;
		        }

		        markerPoint.x = edgePoint.x + (markerRadius * Math.cos(theta));
		        markerPoint.y = edgePoint.y - (markerRadius * Math.sin(theta));

		        return markerPoint;
		    }
		});

		// Initialize Pathfinder for charts
		H.Chart.prototype.callbacks.push(function (chart) {
		    var options = chart.options;
		    if (options.pathfinder.enabled !== false) {
		        this.pathfinder = new Pathfinder(this);
		        this.pathfinder.update(true); // First draw, defer render
		    }
		});

	}(Highcharts, algorithms));
	return (function () {


	}());
}));
