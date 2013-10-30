/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */

Highcharts.theme = {
	colors: ["#f9a028", "#ab6e1b", "#7c5014"],
	chart: {
		backgroundColor: null,
		plotBackgroundColor: null,
		plotShadow: false,
		plotBorderWidth: 0,
		style: {
			fontFamily: 'Dosis, sans-serif'
		}
	},
	title: {
		text: null,
		style: {
			color: '#fff'
		}
	},
	subtitle: {
		style: {
			color: '#ddd'
		}
	},
	xAxis: {
		gridLineWidth: 1,
		gridLineColor: 'rgba(255, 255, 255, .1)',
		lineWidth: 2,
		lineColor: '#666',
		tickWidth: 2,
		tickColor: '#666',
		labels: {
			style: {
				color: '#999', fontSize: '14px'
			}
		},
		title: {
			align: 'high',
			style: {
				color: '#aaa', fontSize: '13px'
			}
		}
	},
	yAxis: {
		gridLineWidth: 1,
		gridLineColor: 'rgba(255, 255, 255, .1)',
		lineWidth: 2,
		lineColor: '#666',
		tickWidth: 1,
		tickColor: '#666',
		minTickInterval: 1,
		labels: {
			style: {
				color: '#999', fontSize: '14px'
			}
		},
		title: {
			style: {
				color: '#aaa', fontSize: '13px'
			}
		}
	},
	legend: {
		align: 'right',
		verticalAlign: 'top',
		floating: true,
		borderWidth: 0,
		itemStyle: {
			color: '#ccc'
		},
		itemHoverStyle: {
			color: '#fff'
		},
		itemHiddenStyle: {
			color: '#333'
		}
	},
	labels: {
		style: {
			color: '#ccc'
		}
	},
	tooltip: {
		backgroundColor: {
			linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
			stops: [
				[0, 'rgba(96, 96, 96, .8)'],
				[1, 'rgba(16, 16, 16, .8)']
			]
		},
		borderWidth: 0,
		style: {
			color: '#fff'
		}
	},


	plotOptions: {
		series: {
			shadow: true,
			marker: {
				enabled: false
			},
			animation: {
				duration: 1500
			}
		},
		line: {
			dataLabels: {
				color: '#ccc'
			}
		},
		pie: {
			borderColor: null,
			borderWidth: 2
		},
		candlestick: {
			lineColor: 'white'
		}
	},

	// scroll charts
	rangeSelector: {
		buttonTheme: {
			fill: {
				linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
				stops: [
					[0.4, '#888'],
					[0.6, '#555']
				]
			},
			stroke: '#000000',
			style: {
				color: '#CCC',
				fontWeight: 'bold'
			},
			states: {
				hover: {
					fill: {
						linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
						stops: [
							[0.4, '#BBB'],
							[0.6, '#888']
						]
					},
					stroke: '#000000',
					style: {
						color: 'white'
					}
				},
				select: {
					fill: {
						linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
						stops: [
							[0.1, '#000'],
							[0.3, '#333']
						]
					},
					stroke: '#000000',
					style: {
						color: 'yellow'
					}
				}
			}
		},
		inputStyle: {
			backgroundColor: '#333',
			color: 'silver'
		},
		labelStyle: {
			color: 'silver'
		}
	},

	global: {
		canvasToolsURL: 'vendor/plot.highcharts/modules/canvas-tools.js',
		useUTC: false
	},

	credits: {
		enabled: false
	}
};

// Apply the theme
var highchartsOptions = Highcharts.setOptions(Highcharts.theme);
