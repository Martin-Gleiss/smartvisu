Name the starting page which is called by index.php as plain "index.php" in the footer menu!

Reason:
at the start of smartVISU, index.php calls index.html in the pages/<yourpath> folder which then includes 
the starting page (here: overview/eg.html). If the footer menu calls index.php?page=overview/eg.html again,
some data get lost resulting in a faulty reaction at the next call of a popup: 
site address is displayed as "index.php?page=overview/eg.html#&ui-state-dialog" but no popup is shown. 

Calling index.php with no arguments from the footer menu solves the problem. 
