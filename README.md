# sChart.js
> :bar_chart: *Small &amp; simple HTML5 charts*

<p>
  <a href="https://www.npmjs.com/package/schart.js"><img src="https://img.shields.io/npm/dm/schart.js.svg" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/schart.js"><img src="https://img.shields.io/npm/v/schart.js.svg" alt="Version"></a>
  <a href="https://www.npmjs.com/package/schart.js"><img src="https://img.shields.io/npm/l/schart.js.svg" alt="License"></a>
  <br>
</p>

## Demo

- [Demo](http://blog.gdfengshuo.com/example/sChart/demo.html)
- [Demo code](https://github.com/lin-xin/sChart.js/blob/master/example/chart.html)

![demo](http://blog.gdfengshuo.com/example/sChart/static/img/demo.png)

## Doc
- [中文文档](http://blog.gdfengshuo.com/example/sChart/index.html)
- [English](http://blog.gdfengshuo.com/example/sChart/en.html)

## Chart Types
The following chart types are implemented:

- Bar Charts
- Line Charts
- Pie Charts
- Ring Charts

## Usage
### Install:
```
npm install schart.js
```
### using Javascript

```js
new sChart(canvasId, type, data, options)
```

### example

```html
<body>
    <canvas id="canvas" width="500" height="400"></canvas>

    <script src="sChart.min.js"></script>
    <script>
        // Bar Charts
        var data = [
            {name:'2014', value:2260},
            {name:'2015', value:1170},
            {name:'2016', value:970},
            {name:'2017', value:1450}
        ]
        new sChart('canvas', 'bar', data, {
            title: '商店近年营业总额'		// The title of a bar chart
        });
    </script>
</body>
```

### Use rem or % in the mobile
```html
<body>
    <div class="schart-wrapper" style="width: 7rem;height: 4rem">
        <canvas id="canvas"></canvas>
    </div>

    <script src="sChart.min.js"></script>
    <script>
        var data = [
            {name:'2014', value:2260},
            {name:'2015', value:1170},
            {name:'2016', value:970},
            {name:'2017', value:1450}
        ]
        new sChart('canvas', 'bar', data, {
            title: '商店近年营业总额',
            autoWidth: true     // 设置宽高自适应父元素宽高
        });
    </script>
</body>
```

## Options

### title
String.The title of chart.
Default is null.

### titleColor
String.Title Color.
Default is '#000000'.

### titlePosition
String.Title position.
Default is 'top'.

### showValue
Display the value in the chart.
Default is true.

### autoWidth
Adaptive width and height.
Default is false.

### bgColor
String.The background color of chart.
Default is '#ffffff'.

### topPadding
Number.Inside top margin of chart.
Default is 50.

### bottomPadding
Number.Inside bottom margin of chart.
Default is 50.

### leftPadding
Number.Inside left margin of chart.
Default is 50.

### rightPadding
Number.Inside right margin of chart.
Default is 0.

### yEqual
Number.The number of points on the Y axis.
Default is 5.

### fillColor
String.The color of bar chart or line chart.
Default is '#1E9FFF'.

### axisColor
String.The color of the coordinate axis.
Default is '#666666'.

### contentColor
String.The color of the horizontal lines of the content.
Default is '#eeeeee'.

### radius
Number.The radius of a pie chart or ring chart.
Default is 100.

### innerRadius
Number.The inner radius of a ring chart.
Default is 700.

### colorList
Array.The color list of a pie chart or ring chart.
Default is ['#1E9FFF', '#13CE66', '#F7BA2A', '#FF4949', '#72f6ff'];

### legendColor
String.The color of the legend text.
Default is '#000000'.

### legendTop
Number.Legend position of top.
Default is 40.

## Relevant
[vue-schart](https://github.com/lin-xin/vue-schart) : Vue.js wrapper for sChart.js

## License
[MIT license](https://github.com/lin-xin/sChart.js/blob/master/LICENCE).