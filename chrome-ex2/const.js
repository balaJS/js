const html_attr = [
    "align",
    "title",
    "lang",
    "translate",
    "dir",
    "hidden",
    "accessKey",
    "draggable",
    "spellcheck",
    "autocapitalize",
    "contentEditable",
    "isContentEditable",
    "inputMode",
    "offsetTop",
    "offsetLeft",
    "offsetWidth",
    "offsetHeight",
    "innerText",
    "outerText",
    "oncopy",
    "oncut",
    "onpaste",
    "onabort",
    "onblur",
    "oncancel",
    "oncanplay",
    "oncanplaythrough",
    "onchange",
    "onclick",
    "onclose",
    "oncontextmenu",
    "oncuechange",
    "ondblclick",
    "ondrag",
    "ondragend",
    "ondragenter",
    "ondragleave",
    "ondragover",
    "ondragstart",
    "ondrop",
    "ondurationchange",
    "onemptied",
    "onended",
    "onerror",
    "onfocus",
    "oninput",
    "oninvalid",
    "onkeydown",
    "onkeypress",
    "onkeyup",
    "onload",
    "onloadeddata",
    "onloadedmetadata",
    "onloadstart",
    "onmousedown",
    "onmouseenter",
    "onmouseleave",
    "onmousemove",
    "onmouseout",
    "onmouseover",
    "onmouseup",
    "onmousewheel",
    "onpause",
    "onplay",
    "onplaying",
    "onprogress",
    "onratechange",
    "onreset",
    "onresize",
    "onscroll",
    "onseeked",
    "onseeking",
    "onselect",
    "onstalled",
    "onsubmit",
    "onsuspend",
    "ontimeupdate",
    "ontoggle",
    "onvolumechange",
    "onwaiting",
    "onwheel",
    "onauxclick",
    "ongotpointercapture",
    "onlostpointercapture",
    "onpointerdown",
    "onpointermove",
    "onpointerup",
    "onpointercancel",
    "onpointerover",
    "onpointerout",
    "onpointerenter",
    "onpointerleave",
    "onselectstart",
    "onselectionchange",
    "onanimationend",
    "onanimationiteration",
    "onanimationstart",
    "ontransitionend",
    "nonce",
    "autofocus",
    "tabIndex",
    "enterKeyHint",
    "onformdata",
    "onpointerrawupdate",
    "namespaceURI",
    "prefix",
    "localName",
    "tagName",
    "id",
    "className",
    "shadowRoot",
    "assignedSlot",
    "innerHTML",
    "outerHTML",
    "scrollTop",
    "scrollLeft",
    "scrollWidth",
    "scrollHeight",
    "clientTop",
    "clientLeft",
    "clientWidth",
    "clientHeight",
    "onbeforecopy",
    "onbeforecut",
    "onbeforepaste",
    "onsearch",
    "elementTiming",
    "previousElementSibling",
    "childElementCount",
    "onfullscreenchange",
    "onfullscreenerror",
    "onwebkitfullscreenchange",
    "onwebkitfullscreenerror",
    "nodeType",
    "nodeName",
    "baseURI",
    "isConnected",
    "nodeValue",
    "textContent",
    "value"
];
    
const css_attr = [
    "alignContent",
    "alignItems",
    "alignSelf",
    "alignmentBaseline",
    "all",
    "animation",
    "animationDelay",
    "animationDirection",
    "animationDuration",
    "animationFillMode",
    "animationIterationCount",
    "animationName",
    "animationPlayState",
    "animationTimingFunction",
    "backdropFilter",
    "backfaceVisibility",
    "background",
    "backgroundAttachment",
    "backgroundBlendMode",
    "backgroundClip",
    "backgroundColor",
    "backgroundImage",
    "backgroundOrigin",
    "backgroundPosition",
    "backgroundPositionX",
    "backgroundPositionY",
    "backgroundRepeat",
    "backgroundRepeatX",
    "backgroundRepeatY",
    "backgroundSize",
    "baselineShift",
    "blockSize",
    "border",
    "borderBlockEnd",
    "borderBlockEndColor",
    "borderBlockEndStyle",
    "borderBlockEndWidth",
    "borderBlockStart",
    "borderBlockStartColor",
    "borderBlockStartStyle",
    "borderBlockStartWidth",
    "borderBottom",
    "borderBottomColor",
    "borderBottomLeftRadius",
    "borderBottomRightRadius",
    "borderBottomStyle",
    "borderBottomWidth",
    "borderCollapse",
    "borderColor",
    "borderImage",
    "borderImageOutset",
    "borderImageRepeat",
    "borderImageSlice",
    "borderImageSource",
    "borderImageWidth",
    "borderInlineEnd",
    "borderInlineEndColor",
    "borderInlineEndStyle",
    "borderInlineEndWidth",
    "borderInlineStart",
    "borderInlineStartColor",
    "borderInlineStartStyle",
    "borderInlineStartWidth",
    "borderLeft",
    "borderLeftColor",
    "borderLeftStyle",
    "borderLeftWidth",
    "borderRadius",
    "borderRight",
    "borderRightColor",
    "borderRightStyle",
    "borderRightWidth",
    "borderSpacing",
    "borderStyle",
    "borderTop",
    "borderTopColor",
    "borderTopLeftRadius",
    "borderTopRightRadius",
    "borderTopStyle",
    "borderTopWidth",
    "borderWidth",
    "bottom",
    "boxShadow",
    "boxSizing",
    "breakAfter",
    "breakBefore",
    "breakInside",
    "bufferedRendering",
    "captionSide",
    "caretColor",
    "clear",
    "clip",
    "clipPath",
    "clipRule",
    "color",
    "colorInterpolation",
    "colorInterpolationFilters",
    "colorRendering",
    "columnCount",
    "columnFill",
    "columnGap",
    "columnRule",
    "columnRuleColor",
    "columnRuleStyle",
    "columnRuleWidth",
    "columnSpan",
    "columnWidth",
    "columns",
    "contain",
    "content",
    "counterIncrement",
    "counterReset",
    "cursor",
    "cx",
    "cy",
    "d",
    "direction",
    "display",
    "dominantBaseline",
    "emptyCells",
    "fill",
    "fillOpacity",
    "fillRule",
    "filter",
    "flex",
    "flexBasis",
    "flexDirection",
    "flexFlow",
    "flexGrow",
    "flexShrink",
    "flexWrap",
    "float",
    "floodColor",
    "floodOpacity",
    "font",
    "fontDisplay",
    "fontFamily",
    "fontFeatureSettings",
    "fontKerning",
    "fontOpticalSizing",
    "fontSize",
    "fontStretch",
    "fontStyle",
    "fontVariant",
    "fontVariantCaps",
    "fontVariantEastAsian",
    "fontVariantLigatures",
    "fontVariantNumeric",
    "fontVariationSettings",
    "fontWeight",
    "gap",
    "grid",
    "gridArea",
    "gridAutoColumns",
    "gridAutoFlow",
    "gridAutoRows",
    "gridColumn",
    "gridColumnEnd",
    "gridColumnGap",
    "gridColumnStart",
    "gridGap",
    "gridRow",
    "gridRowEnd",
    "gridRowGap",
    "gridRowStart",
    "gridTemplate",
    "gridTemplateAreas",
    "gridTemplateColumns",
    "gridTemplateRows",
    "height",
    "hyphens",
    "imageRendering",
    "inlineSize",
    "isolation",
    "justifyContent",
    "justifyItems",
    "justifySelf",
    "left",
    "letterSpacing",
    "lightingColor",
    "lineBreak",
    "lineHeight",
    "listStyle",
    "listStyleImage",
    "listStylePosition",
    "listStyleType",
    "margin",
    "marginBlockEnd",
    "marginBlockStart",
    "marginBottom",
    "marginInlineEnd",
    "marginInlineStart",
    "marginLeft",
    "marginRight",
    "marginTop",
    "marker",
    "markerEnd",
    "markerMid",
    "markerStart",
    "mask",
    "maskType",
    "maxBlockSize",
    "maxHeight",
    "maxInlineSize",
    "maxWidth",
    "maxZoom",
    "minBlockSize",
    "minHeight",
    "minInlineSize",
    "minWidth",
    "minZoom",
    "mixBlendMode",
    "objectFit",
    "objectPosition",
    "offset",
    "offsetDistance",
    "offsetPath",
    "offsetRotate",
    "opacity",
    "order",
    "orientation",
    "orphans",
    "outline",
    "outlineColor",
    "outlineOffset",
    "outlineStyle",
    "outlineWidth",
    "overflow",
    "overflowAnchor",
    "overflowWrap",
    "overflowX",
    "overflowY",
    "overscrollBehavior",
    "overscrollBehaviorBlock",
    "overscrollBehaviorInline",
    "overscrollBehaviorX",
    "overscrollBehaviorY",
    "padding",
    "paddingBlockEnd",
    "paddingBlockStart",
    "paddingBottom",
    "paddingInlineEnd",
    "paddingInlineStart",
    "paddingLeft",
    "paddingRight",
    "paddingTop",
    "page",
    "pageBreakAfter",
    "pageBreakBefore",
    "pageBreakInside",
    "paintOrder",
    "perspective",
    "perspectiveOrigin",
    "placeContent",
    "placeItems",
    "placeSelf",
    "pointerEvents",
    "position",
    "quotes",
    "r",
    "resize",
    "right",
    "rowGap",
    "rx",
    "ry",
    "scrollBehavior",
    "scrollMargin",
    "scrollMarginBlock",
    "scrollMarginBlockEnd",
    "scrollMarginBlockStart",
    "scrollMarginBottom",
    "scrollMarginInline",
    "scrollMarginInlineEnd",
    "scrollMarginInlineStart",
    "scrollMarginLeft",
    "scrollMarginRight",
    "scrollMarginTop",
    "scrollPadding",
    "scrollPaddingBlock",
    "scrollPaddingBlockEnd",
    "scrollPaddingBlockStart",
    "scrollPaddingBottom",
    "scrollPaddingInline",
    "scrollPaddingInlineEnd",
    "scrollPaddingInlineStart",
    "scrollPaddingLeft",
    "scrollPaddingRight",
    "scrollPaddingTop",
    "scrollSnapAlign",
    "scrollSnapStop",
    "scrollSnapType",
    "shapeImageThreshold",
    "shapeMargin",
    "shapeOutside",
    "shapeRendering",
    "size",
    "speak",
    "src",
    "stopColor",
    "stopOpacity",
    "stroke",
    "strokeDasharray",
    "strokeDashoffset",
    "strokeLinecap",
    "strokeLinejoin",
    "strokeMiterlimit",
    "strokeOpacity",
    "strokeWidth",
    "tabSize",
    "tableLayout",
    "textAlign",
    "textAlignLast",
    "textAnchor",
    "textCombineUpright",
    "textDecoration",
    "textDecorationColor",
    "textDecorationLine",
    "textDecorationSkipInk",
    "textDecorationStyle",
    "textIndent",
    "textOrientation",
    "textOverflow",
    "textRendering",
    "textShadow",
    "textSizeAdjust",
    "textTransform",
    "textUnderlinePosition",
    "top",
    "touchAction",
    "transform",
    "transformBox",
    "transformOrigin",
    "transformStyle",
    "transition",
    "transitionDelay",
    "transitionDuration",
    "transitionProperty",
    "transitionTimingFunction",
    "unicodeBidi",
    "unicodeRange",
    "userSelect",
    "userZoom",
    "vectorEffect",
    "verticalAlign",
    "visibility",
    "webkitAlignContent",
    "webkitAlignItems",
    "webkitAlignSelf",
    "webkitAnimation",
    "webkitAnimationDelay",
    "webkitAnimationDirection",
    "webkitAnimationDuration",
    "webkitAnimationFillMode",
    "webkitAnimationIterationCount",
    "webkitAnimationName",
    "webkitAnimationPlayState",
    "webkitAnimationTimingFunction",
    "webkitAppRegion",
    "webkitAppearance",
    "webkitBackfaceVisibility",
    "webkitBackgroundClip",
    "webkitBackgroundOrigin",
    "webkitBackgroundSize",
    "webkitBorderAfter",
    "webkitBorderAfterColor",
    "webkitBorderAfterStyle",
    "webkitBorderAfterWidth",
    "webkitBorderBefore",
    "webkitBorderBeforeColor",
    "webkitBorderBeforeStyle",
    "webkitBorderBeforeWidth",
    "webkitBorderBottomLeftRadius",
    "webkitBorderBottomRightRadius",
    "webkitBorderEnd",
    "webkitBorderEndColor",
    "webkitBorderEndStyle",
    "webkitBorderEndWidth",
    "webkitBorderHorizontalSpacing",
    "webkitBorderImage",
    "webkitBorderRadius",
    "webkitBorderStart",
    "webkitBorderStartColor",
    "webkitBorderStartStyle",
    "webkitBorderStartWidth",
    "webkitBorderTopLeftRadius",
    "webkitBorderTopRightRadius",
    "webkitBorderVerticalSpacing",
    "webkitBoxAlign",
    "webkitBoxDecorationBreak",
    "webkitBoxDirection",
    "webkitBoxFlex",
    "webkitBoxOrdinalGroup",
    "webkitBoxOrient",
    "webkitBoxPack",
    "webkitBoxReflect",
    "webkitBoxShadow",
    "webkitBoxSizing",
    "webkitClipPath",
    "webkitColumnBreakAfter",
    "webkitColumnBreakBefore",
    "webkitColumnBreakInside",
    "webkitColumnCount",
    "webkitColumnGap",
    "webkitColumnRule",
    "webkitColumnRuleColor",
    "webkitColumnRuleStyle",
    "webkitColumnRuleWidth",
    "webkitColumnSpan",
    "webkitColumnWidth",
    "webkitColumns",
    "webkitFilter",
    "webkitFlex",
    "webkitFlexBasis",
    "webkitFlexDirection",
    "webkitFlexFlow",
    "webkitFlexGrow",
    "webkitFlexShrink",
    "webkitFlexWrap",
    "webkitFontFeatureSettings",
    "webkitFontSizeDelta",
    "webkitFontSmoothing",
    "webkitHighlight",
    "webkitHyphenateCharacter",
    "webkitJustifyContent",
    "webkitLineBreak",
    "webkitLineClamp",
    "webkitLocale",
    "webkitLogicalHeight",
    "webkitLogicalWidth",
    "webkitMarginAfter",
    "webkitMarginAfterCollapse",
    "webkitMarginBefore",
    "webkitMarginBeforeCollapse",
    "webkitMarginBottomCollapse",
    "webkitMarginCollapse",
    "webkitMarginEnd",
    "webkitMarginStart",
    "webkitMarginTopCollapse",
    "webkitMask",
    "webkitMaskBoxImage",
    "webkitMaskBoxImageOutset",
    "webkitMaskBoxImageRepeat",
    "webkitMaskBoxImageSlice",
    "webkitMaskBoxImageSource",
    "webkitMaskBoxImageWidth",
    "webkitMaskClip",
    "webkitMaskComposite",
    "webkitMaskImage",
    "webkitMaskOrigin",
    "webkitMaskPosition",
    "webkitMaskPositionX",
    "webkitMaskPositionY",
    "webkitMaskRepeat",
    "webkitMaskRepeatX",
    "webkitMaskRepeatY",
    "webkitMaskSize",
    "webkitMaxLogicalHeight",
    "webkitMaxLogicalWidth",
    "webkitMinLogicalHeight",
    "webkitMinLogicalWidth",
    "webkitOpacity",
    "webkitOrder",
    "webkitPaddingAfter",
    "webkitPaddingBefore",
    "webkitPaddingEnd",
    "webkitPaddingStart",
    "webkitPerspective",
    "webkitPerspectiveOrigin",
    "webkitPerspectiveOriginX",
    "webkitPerspectiveOriginY",
    "webkitPrintColorAdjust",
    "webkitRtlOrdering",
    "webkitRubyPosition",
    "webkitShapeImageThreshold",
    "webkitShapeMargin",
    "webkitShapeOutside",
    "webkitTapHighlightColor",
    "webkitTextCombine",
    "webkitTextDecorationsInEffect",
    "webkitTextEmphasis",
    "webkitTextEmphasisColor",
    "webkitTextEmphasisPosition",
    "webkitTextEmphasisStyle",
    "webkitTextFillColor",
    "webkitTextOrientation",
    "webkitTextSecurity",
    "webkitTextSizeAdjust",
    "webkitTextStroke",
    "webkitTextStrokeColor",
    "webkitTextStrokeWidth",
    "webkitTransform",
    "webkitTransformOrigin",
    "webkitTransformOriginX",
    "webkitTransformOriginY",
    "webkitTransformOriginZ",
    "webkitTransformStyle",
    "webkitTransition",
    "webkitTransitionDelay",
    "webkitTransitionDuration",
    "webkitTransitionProperty",
    "webkitTransitionTimingFunction",
    "webkitUserDrag",
    "webkitUserModify",
    "webkitUserSelect",
    "webkitWritingMode",
    "whiteSpace",
    "widows",
    "width",
    "willChange",
    "wordBreak",
    "wordSpacing",
    "wordWrap",
    "writingMode",
    "x",
    "y",
    "zIndex",
    "zoom"
];