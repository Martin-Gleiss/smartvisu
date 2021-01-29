<?php

// provide replacement proposals for removed widgets even if they have been removed already
// Author: Wolfram v. Hülsen

class OldWidgets {
	
	public static function getRemoved() {
		return array(
			"basic.button" => array(
				"name" => "button",
				"params" => "id, item, txt, pic, val, type, color",
				"removed" => true,
				"replacement" => "basic.stateswitch(%1\$s, %2\$s, %6\$s, %5\$s, %4\$s, %3\$s, %7\$s)",
				),
			"basic.dual" => array (
				"name" => "dual",
				"params" => "id, item, pic_on, pic_off, val_on, val_off, type, color_on, color_off",
				"removed" => true,
				"replacement" => "basic.stateswitch(%1\$s, %2\$s, %7\$s, [%5\$s, %6\$s], [%3\$s, %4\$s], '', [%8\$s, %9\$s])",
				),
			"basic.colordisc" => array (
				"name" => "colordisc",
				"params" => "id, item_r, item_g, item_b, min, max, step, colors",
				"removed" => true,
				"replacement" => "basic.color(%1\$s, %2\$s, %3\$s, %4\$s, %5\$s, %6\$s, %7\$s, %8\$s, 'disc')",
				),
			"basic.float" => array (
				"name" => "float",
				"params" => "id, item, unit, tag, threshold, color",
				"removed" => true,
				"replacement" => "basic.print(%1\$s, %2\$s, %3\$s, '', %5\$s, %6\$s)",
				),
			"basic.formula" => array (
				"name" => "formula",
				"params" => "id, item, unit, formula, threshold, color",
				"removed" => true,
				"replacement" => "basic.print(%1\$s, %2\$s, %3\$s, %4\$s, %5\$s, %6\$s)",
				),
			"basic.rgb" => array (
				"name" => "rgb",
				"params" => "id, item_r, item_g, item_b, min, max, step, colors",
				"removed" => true,
				"replacement" => "basic.color(%1\$s, %2\$s, %3\$s, %4\$s, %5\$s, %6\$s, %7\$s, %8\$s, 'rect')",
				),
			"basic.multistate" => array (
				"name" => "multistate",
				"params" => "id, item, val, img, type, color",
				"removed" => true,
				"replacement" => "basic.stateswitch(%1\$s, %2\$s, %5\$s, %3\$s, %4\$s, '', %5\$s)",
				),
			"basic.switch" => array (
				"name" => "switch",
				"params" => "id, item, pic_on, pic_off, val_on, val_off, color_on, color_off",
				"removed" => true,
				"replacement" => "basic.stateswitch(%1\$s, %2\$s, 'icon', [%5\$s, %6\$s], [%3\$s, %4\$s], '', [%7\$s, %8\$s])",
				),
			"basic.text" => array (
				"name" => "text",
				"params" => "id, item, txt_on, txt_off, val_on, val_off",
				"removed" => true,
				"replacement" => "basic.symbol(%1\$s, %2\$s, [%3\$s, %4\$s], [%5\$s, %6\$s])",
				),
			"basic.value" => array (
				"name" => "value",
				"params" => "id, item, unit, tag, threshold, color",
				"removed" => true,
				"replacement" => "basic.print(%1\$s, %2\$s, %3\$s, '', %5\$s, %6\$s)",
				),
			"plot.minmaxavg" => array (
				"name" => "minmaxavg",
				"params" => "id, item, tmin, tmax, ymin, ymax, unit, axis, count",
				"removed" => true,
				"replacement" => "plot.period(%1\$s, %2\$s, 'minmaxavg', %3\$s, %4\$s, %5\$s, %6\$s, %9\$s, '', '', '', %8\$s, '', '', '', '', %7\$s)",
				),
			"plot.multiaxis" => array (
				"name" => "multiaxis",
				"params" => "id, item, mode, tmin, tmax, ymin, ymax, count, label, color, exposure, axis, zoom, assign, opposite, ycolor",
				"removed" => true,
				"replacement" => "plot.period(%1\$s, %2\$s, %3\$s, %4\$s, %5\$s, %6\$s, %7\$s, %8\$s, %9\$s, %10\$s, %11\$s, %12\$s, %13\$s, %14\$s, %15\$s, %16\$s)",
				),
		);
	}
}
