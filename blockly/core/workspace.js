/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Object representing a workspace.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Workspace');

// TODO(scr): Fix circular dependencies
// goog.require('Blockly.Block');
goog.require('Blockly.ScrollbarPair');
goog.require('Blockly.Trashcan');
goog.require('Blockly.Xml');
// If zoom controls aren't required, then Blockly.inject's
// "zoom"/"controls" configuration must be false.
goog.require('Blockly.ZoomControls');


/**
 * Class for a workspace.
 * @param {Function} getMetrics A function that returns size/scrolling metrics.
 * @param {Function} setMetrics A function that sets size/scrolling metrics.
 * @constructor
 */
Blockly.Workspace = function(getMetrics, setMetrics) {
  this.getMetrics = getMetrics;
  this.setMetrics = setMetrics;

  /** @type {boolean} */
  this.isFlyout = false;
  /**
   * @type {!Array.<!Blockly.Block>}
   * @private
   */
  this.topBlocks_ = [];

  /** @type {number} */
  this.maxBlocks = Infinity;

  Blockly.ConnectionDB.init(this);
};

/**
 * Angle away from the horizontal to sweep for blocks.  Order of execution is
 * generally top to bottom, but a small angle changes the scan to give a bit of
 * a left to right bias (reversed in RTL).  Units are in degrees.
 * See: http://tvtropes.org/pmwiki/pmwiki.php/Main/DiagonalBilling.
 */
Blockly.Workspace.SCAN_ANGLE = 3;

/**
 * Can this workspace be dragged around (true) or is it fixed (false)?
 * @type {boolean}
 */
Blockly.Workspace.prototype.dragMode = false;

/**
 * Current horizontal scrolling offset.
 * @type {number}
 */
Blockly.Workspace.prototype.scrollX = 0;

/**
 * Current vertical scrolling offset.
 * @type {number}
 */
Blockly.Workspace.prototype.scrollY = 0;

/**
 * The workspace's trashcan (if any).
 * @type {Blockly.Trashcan}
 */
Blockly.Workspace.prototype.trashcan = null;

/**
 * PID of upcoming firing of a change event.  Used to fire only one event
 * after multiple changes.
 * @type {?number}
 * @private
 */
Blockly.Workspace.prototype.fireChangeEventPid_ = null;

/**
 * This workspace's scrollbars, if they exist.
 * @type {Blockly.ScrollbarPair}
 */
Blockly.Workspace.prototype.scrollbar = null;

/**
 * Create the trash can elements.
 * @return {!Element} The workspace's SVG group.
 */
Blockly.Workspace.prototype.createDom = function() {
  /*
  <g>
    [Trashcan may go here]
    <g></g>
    <g></g>
  </g>
  */
  this.svgGroup_ = Blockly.createSvgElement('g', {}, null);
  this.svgBlockCanvas_ = Blockly.createSvgElement('g', {}, this.svgGroup_);
  this.svgBubbleCanvas_ = Blockly.createSvgElement('g', {}, this.svgGroup_);
  this.fireChangeEvent();
  return this.svgGroup_;
};

/**
 * Dispose of this workspace.
 * Unlink from all DOM elements to prevent memory leaks.
 */
Blockly.Workspace.prototype.dispose = function() {
  if (this.svgGroup_) {
    goog.dom.removeNode(this.svgGroup_);
    this.svgGroup_ = null;
  }
  this.svgBlockCanvas_ = null;
  this.svgBubbleCanvas_ = null;
  if (this.trashcan) {
    this.trashcan.dispose();
    this.trashcan = null;
  }
};

/**
 * Add a trashcan.
 */
Blockly.Workspace.prototype.addTrashcan = function(verticalSpacing) {
  if (Blockly.hasTrashcan && !Blockly.readOnly) {
    this.trashcan = new Blockly.Trashcan(this);
    var svgTrashcan = this.trashcan.createDom();
    this.svgGroup_.insertBefore(svgTrashcan, this.svgBlockCanvas_);
    return this.trashcan.init(verticalSpacing);
  }
};

/**
 * Add zoom controls.
 * @package
 */
Blockly.Workspace.prototype.addZoomControls = function(verticalSpacing) {
  if (!Blockly.ZoomControls) {
    throw Error('Missing require for Blockly.ZoomControls');
  }
  /** @type {Blockly.ZoomControls} */
  this.zoomControls_ = new Blockly.ZoomControls(this);
  var svgZoomControls = this.zoomControls_.createDom();
  this.svgGroup_.insertBefore(svgZoomControls, this.svgBlockCanvas_);
  //this.svgGroup_.appendChild(svgZoomControls);
  return this.zoomControls_.init(verticalSpacing);
};

/**
 * Get the SVG element that forms the drawing surface.
 * @return {!Element} SVG element.
 */
Blockly.Workspace.prototype.getCanvas = function() {
  return this.svgBlockCanvas_;
};

/**
 * Get the SVG element that forms the bubble surface.
 * @return {!SVGGElement} SVG element.
 */
Blockly.Workspace.prototype.getBubbleCanvas = function() {
  return this.svgBubbleCanvas_;
};

/**
 * Add a block to the list of top blocks.
 * @param {!Blockly.Block} block Block to remove.
 */
Blockly.Workspace.prototype.addTopBlock = function(block) {
  this.topBlocks_.push(block);
  if (Blockly.Realtime.isEnabled() && this == Blockly.mainWorkspace) {
    Blockly.Realtime.addTopBlock(block);
  }
  this.fireChangeEvent();
};

/**
 * Remove a block from the list of top blocks.
 * @param {!Blockly.Block} block Block to remove.
 */
Blockly.Workspace.prototype.removeTopBlock = function(block) {
  var found = false;
  for (var child, x = 0; child = this.topBlocks_[x]; x++) {
    if (child == block) {
      this.topBlocks_.splice(x, 1);
      found = true;
      break;
    }
  }
  if (!found) {
    throw 'Block not present in workspace\'s list of top-most blocks.';
  }
  if (Blockly.Realtime.isEnabled() && this == Blockly.mainWorkspace) {
    Blockly.Realtime.removeTopBlock(block);
  }
  this.fireChangeEvent();
};

/**
 * Finds the top-level blocks and returns them.  Blocks are optionally sorted
 * by position; top to bottom (with slight LTR or RTL bias).
 * @param {boolean} ordered Sort the list if true.
 * @return {!Array.<!Blockly.Block>} The top-level block objects.
 */
Blockly.Workspace.prototype.getTopBlocks = function(ordered) {
  // Copy the topBlocks_ list.
  var blocks = [].concat(this.topBlocks_);
  if (ordered && blocks.length > 1) {
    var offset = Math.sin(Blockly.Workspace.SCAN_ANGLE / 180 * Math.PI);
    if (Blockly.RTL) {
      offset *= -1;
    }
    blocks.sort(function(a, b) {
      var aXY = a.getRelativeToSurfaceXY();
      var bXY = b.getRelativeToSurfaceXY();
      return (aXY.y + offset * aXY.x) - (bXY.y + offset * bXY.x);
    });
  }
  return blocks;
};

/**
 * Find all blocks in workspace.  No particular order.
 * @return {!Array.<!Blockly.Block>} Array of blocks.
 */
Blockly.Workspace.prototype.getAllBlocks = function() {
  var blocks = this.getTopBlocks(false);
  for (var x = 0; x < blocks.length; x++) {
    blocks.push.apply(blocks, blocks[x].getChildren());
  }
  return blocks;
};

/**
 * Dispose of all blocks in workspace.
 */
Blockly.Workspace.prototype.clear = function() {
  Blockly.hideChaff();
  while (this.topBlocks_.length) {
    this.topBlocks_[0].dispose();
  }
};

/**
 * Render all blocks in workspace.
 */
Blockly.Workspace.prototype.render = function() {
  var renderList = this.getAllBlocks();
  for (var x = 0, block; block = renderList[x]; x++) {
    if (!block.getChildren().length) {
      block.render();
    }
  }
};

/**
 * Finds the block with the specified ID in this workspace.
 * @param {string} id ID of block to find.
 * @return {Blockly.Block} The matching block, or null if not found.
 */
Blockly.Workspace.prototype.getBlockById = function(id) {
  // If this O(n) function fails to scale well, maintain a hash table of IDs.
  var blocks = this.getAllBlocks();
  for (var x = 0, block; block = blocks[x]; x++) {
    if (block.id == id) {
      return block;
    }
  }
  return null;
};

/**
 * Turn the visual trace functionality on or off.
 * @param {boolean} armed True if the trace should be on.
 */
Blockly.Workspace.prototype.traceOn = function(armed) {
  this.traceOn_ = armed;
  if (this.traceWrapper_) {
    Blockly.unbindEvent_(this.traceWrapper_);
    this.traceWrapper_ = null;
  }
  if (armed) {
    this.traceWrapper_ = Blockly.bindEvent_(this.svgBlockCanvas_,
        'blocklySelectChange', this, function() {this.traceOn_ = false});
  }
};

/**
 * Highlight a block in the workspace.
 * @param {?string} id ID of block to find.
 */
Blockly.Workspace.prototype.highlightBlock = function(id) {
  if (this.traceOn_ && Blockly.Block.dragMode_ != 0) {
    // The blocklySelectChange event normally prevents this, but sometimes
    // there is a race condition on fast-executing apps.
    this.traceOn(false);
  }
  if (!this.traceOn_) {
    return;
  }
  var block = null;
  if (id) {
    block = this.getBlockById(id);
    if (!block) {
      return;
    }
  }
  // Temporary turn off the listener for selection changes, so that we don't
  // trip the monitor for detecting user activity.
  this.traceOn(false);
  // Select the current block.
  if (block) {
    block.select();
  } else if (Blockly.selected) {
    Blockly.selected.unselect();
  }
  // Restore the monitor for user activity after the selection event has fired.
  var thisWorkspace = this;
  setTimeout(function() {thisWorkspace.traceOn(true);}, 1);
};

/**
 * Fire a change event for this workspace.  Changes include new block, dropdown
 * edits, mutations, connections, etc.  Groups of simultaneous changes (e.g.
 * a tree of blocks being deleted) are merged into one event.
 * Applications may hook workspace changes by listening for
 * 'blocklyWorkspaceChange' on Blockly.mainWorkspace.getCanvas().
 */
Blockly.Workspace.prototype.fireChangeEvent = function() {
  if (this.fireChangeEventPid_) {
    window.clearTimeout(this.fireChangeEventPid_);
  }
  var canvas = this.svgBlockCanvas_;
  if (canvas) {
    this.fireChangeEventPid_ = window.setTimeout(function() {
        Blockly.fireUiEvent(canvas, 'blocklyWorkspaceChange');
      }, 0);
  }
};

/**
 * Paste the provided block onto the workspace.
 * @param {!Element} xmlBlock XML block element.
 */
Blockly.Workspace.prototype.paste = function(xmlBlock) {
  if (xmlBlock.getElementsByTagName('block').length >=
      this.remainingCapacity()) {
    return;
  }
  var block = Blockly.Xml.domToBlock(this, xmlBlock);
  // Move the duplicate to original position.
  var blockX = parseInt(xmlBlock.getAttribute('x'), 10);
  var blockY = parseInt(xmlBlock.getAttribute('y'), 10);
  if (!isNaN(blockX) && !isNaN(blockY)) {
    if (Blockly.RTL) {
      blockX = -blockX;
    }
    // Offset block until not clobbering another block.
    do {
      var collide = false;
      var allBlocks = this.getAllBlocks();
      for (var x = 0, otherBlock; otherBlock = allBlocks[x]; x++) {
        var otherXY = otherBlock.getRelativeToSurfaceXY();
        if (Math.abs(blockX - otherXY.x) <= 1 &&
            Math.abs(blockY - otherXY.y) <= 1) {
          if (Blockly.RTL) {
            blockX -= Blockly.SNAP_RADIUS;
          } else {
            blockX += Blockly.SNAP_RADIUS;
          }
          blockY += Blockly.SNAP_RADIUS * 2;
          collide = true;
        }
      }
    } while (collide);
    block.moveBy(blockX, blockY);
  }
  block.select();
};

/**
 * The number of blocks that may be added to the workspace before reaching
 *     the maxBlocks.
 * @return {number} Number of blocks left.
 */
Blockly.Workspace.prototype.remainingCapacity = function() {
  if (this.maxBlocks == Infinity) {
    return Infinity;
  }
  return this.maxBlocks - this.getAllBlocks().length;
};

// Export symbols that would otherwise be renamed by Closure compiler.
Blockly.Workspace.prototype['clear'] = Blockly.Workspace.prototype.clear;

/**
 * Zooms the workspace in or out relative to/centered on the given (x, y)
 * coordinate.
 * @param {number} x X coordinate of center, in pixel units relative to the
 *     top-left corner of the parentSVG.
 * @param {number} y Y coordinate of center, in pixel units relative to the
 *     top-left corner of the parentSVG.
 * @param {number} amount Amount of zooming. The formula for the new scale
 *     is newScale = currentScale * (scaleSpeed^amount). scaleSpeed is set in
 *     the workspace options. Negative amount values zoom out, and positive
 *     amount values zoom in.
 */
Blockly.Workspace.prototype.zoom = function(x, y, amount) {
  // Scale factor.
  var speed = this.options.zoomOptions.scaleSpeed;
  var scaleChange = Math.pow(speed, amount);
  var newScale = this.scale * scaleChange;
  if (this.scale == newScale) {
    return;  // No change in zoom.
  }

  // Clamp scale within valid range.
  if (newScale > this.options.zoomOptions.maxScale) {
    scaleChange = this.options.zoomOptions.maxScale / this.scale;
  } else if (newScale < this.options.zoomOptions.minScale) {
    scaleChange = this.options.zoomOptions.minScale / this.scale;
  }

  // Transform the x/y coordinates from the parentSVG's space into the
  // canvas' space, so that they are in workspace units relative to the top
  // left of the visible portion of the workspace.
  var matrix = this.getCanvas().getCTM();
  var center = this.getParentSvg().createSVGPoint();
  center.x = x;
  center.y = y;
  center = center.matrixTransform(matrix.inverse());
  x = center.x;
  y = center.y;

  // Find the new scrollX/scrollY so that the center remains in the same
  // position (relative to the center) after we zoom.
  // newScale and matrix.a should be identical (within a rounding error).
  matrix = matrix.translate(x * (1 - scaleChange), y * (1 - scaleChange))
      .scale(scaleChange);
  // scrollX and scrollY are in pixels.
  // The scrollX and scrollY still need to have absoluteLeft and absoluteTop
  // subtracted from them, but we'll leave that for setScale so that they're
  // correctly updated for the new flyout size if we have a simple toolbox.
  this.scrollX = matrix.e;
  this.scrollY = matrix.f;
  this.setScale(newScale);
};

/**
 * Zooming the blocks centered in the center of view with zooming in or out.
 * @param {number} type Type of zooming (-1 zooming out and 1 zooming in).
 */
Blockly.Workspace.prototype.zoomCenter = function(type) {
  var metrics = this.getMetrics();
  if (this.flyout_) {
    // If you want blocks in the center of the view (visible portion of the
    // workspace) to stay centered when the size of the view decreases (i.e.
    // when the size of the flyout increases) you need the center of the
    // *blockly div* to stay in the same pixel-position.
    // Note: This only works because of how scrollCenter positions blocks.
    var x = metrics.svgWidth ? metrics.svgWidth / 2 : 0;
    var y = metrics.svgHeight ? metrics.svgHeight / 2 : 0;
  } else {
    var x = (metrics.viewWidth / 2) + metrics.absoluteLeft;
    var y = (metrics.viewHeight / 2) + metrics.absoluteTop;
  }
  this.zoom(x, y, type);
};

/**
 * Zoom the blocks to fit in the workspace if possible.
 */
Blockly.Workspace.prototype.zoomToFit = function() {
  if (!this.isMovable()) {
    console.warn('Tried to move a non-movable workspace. This could result' +
        ' in blocks becoming inaccessible.');
    return;
  }

  var metrics = this.getMetrics();
  var workspaceWidth = metrics.viewWidth;
  var workspaceHeight = metrics.viewHeight;
  var blocksBox = this.getBlocksBoundingBox();
  var blocksWidth = blocksBox.right - blocksBox.left;
  var blocksHeight = blocksBox.bottom - blocksBox.top;
  if (!blocksWidth) {
    return;  // Prevents zooming to infinity.
  }
  if (this.flyout_) {
    // We have to add the flyout size to both the workspace size and the
    // block size because the blocks we want to resize include the blocks in
    // the flyout, and the area we want to fit them includes the portion of
    // the workspace that is behind the flyout.
    if (this.horizontalLayout) {
      workspaceHeight += this.flyout_.getHeight();
      // Convert from pixels to workspace coordinates.
      blocksHeight += this.flyout_.getHeight() / this.scale;
    } else {
      workspaceWidth += this.flyout_.getWidth();
      // Convert from pixels to workspace coordinates.
      blocksWidth += this.flyout_.getWidth() / this.scale;
    }
  }

  // Scale Units: (pixels / workspaceUnit)
  var ratioX = workspaceWidth / blocksWidth;
  var ratioY = workspaceHeight / blocksHeight;
  this.setScale(Math.min(ratioX, ratioY));
  this.scrollCenter();
};