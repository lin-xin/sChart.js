function sChart(canvas, type, data, options) {
    this.canvas = document.getElementById(canvas);
    this.ctx = this.canvas.getContext('2d');
    this.type = type;
    this.data = data;                           // 存放图表数据
    this.dataLength = this.data.length;         // 图表数据的长度
    this.width = this.canvas.width;             // canvas 宽度
    this.height = this.canvas.height;           // canvas 高度
    this.padding = 50;                          // canvas 内边距
    this.yEqual = 5;                            // y轴分成5等分
    this.yLength = 0;                           // y轴坐标点之间的真实长度
    this.xLength = 0;                           // x轴坐标点之间的真实长度
    this.yFictitious = 0;                       // y轴坐标点之间显示的间距
    this.yRatio = 0;                            // y轴坐标真实长度和坐标间距的比
    this.bgColor = '#ffffff';                   // 默认背景颜色
    this.fillColor = '#1E9FFF';                 // 默认填充颜色
    this.axisColor = '#666666';                 // 坐标轴颜色
    this.contentColor = '#eeeeee';              // 内容横线颜色
    this.titleColor = '#000000';                // 图表标题颜色
	this.title = '';                            // 图表标题
	this.titlePosition = 'top';                 // 图表标题位置: top / bottom
    this.looped = null;                         // 是否循环
    this.current = 0;                           // 当前加载柱状图高度的百分数
    this.radius = 100;                          // 饼图半径和环形图外圆半径
    this.innerRadius = 70;                      // 环形图内圆半径
    this.colorList = ['#1E9FFF', '#13CE66', '#F7BA2A', '#FF4949', '#72f6ff', '#72f6ff'];    // 饼图颜色列表
    this.legendColor = '#000000';               // 图例文字颜色
    this.legendTop = 40;                        // 图例距离顶部高度
    this.totalValue = this.getTotalValue();     // 获取饼图数据总和
    this.init(options);
}
sChart.prototype = {
    init: function(options) {
        if(options){
            this.padding = options.padding || 50;
            this.yEqual = options.yEqual || 5;
            this.bgColor = options.bgColor || this.bgColor;
            this.fillColor = options.fillColor || this.fillColor;
            this.axisColor = options.axisColor || this.axisColor;
            this.contentColor = options.contentColor || this.contentColor;
            this.titleColor = options.titleColor || this.titleColor;
            this.title = options.title;
            this.titlePosition = options.titlePosition || this.titlePosition;
            this.legendColor = options.legendColor || this.legendColor;
            this.legendTop = options.legendTop || this.legendTop;
            this.colorList = options.colorList ? options.colorList.concat(this.colorList) : this.colorList;
            this.radius = options.radius || this.radius;
            this.innerRadius = options.innerRadius || this.innerRadius;
        }
        if(this.type === 'bar' || this.type === 'line'){
            this.yLength = Math.floor((this.height - this.padding * 2 - 10) / this.yEqual);
            this.xLength = Math.floor((this.width - this.padding * 1.5 - 10) / this.dataLength);
            this.yFictitious = this.getYFictitious(this.data);
            this.yRatio = this.yLength / this.yFictitious;
            this.looping();
        }else{
            this.drawPieUpdate();
        }
    },
    looping: function() {
        this.looped = requestAnimationFrame(this.looping.bind(this));
        if(this.current < 100){
			this.current = (this.current + 3) > 100 ? 100 : (this.current + 3);
            this.drawAnimation();
        }else{
            window.cancelAnimationFrame(this.looped);
            this.looped = null;
        }
    },
    drawAnimation: function() {
        for(var i = 0; i < this.dataLength; i++) {
            var x = Math.ceil(this.data[i].value * this.current / 100 * this.yRatio);
            var y = this.height - this.padding - x;
            
            this.data[i].left = this.padding + this.xLength * (i + 0.25);
            this.data[i].top = y;
            this.data[i].right = this.padding + this.xLength * (i + 0.75);
            this.data[i].bottom = this.height - this.padding;
            this.drawBarUpdate();
        }
    },
    drawBarUpdate: function() {
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.drawAxis();
        this.drawPoint();
        this.drawTitle();
        this.drawBarChart();
    },
    drawPieUpdate: function() {
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.drawLegend();
        this.drawTitle();
        this.drawPieChart();
    },
    drawBarChart: function() {
        this.ctx.fillStyle = this.fillColor;
        this.ctx.strokeStyle = this.fillColor;
        for(var i = 0; i < this.dataLength; i++) {
            if(this.type === 'line'){
                this.ctx.beginPath();
                this.ctx.arc(this.data[i].left+ this.xLength / 4, this.data[i].top, 2, 0, 2 * Math.PI,true);
                this.ctx.fill();
                if(i !== this.dataLength-1){
                    this.ctx.moveTo(this.data[i].left+ this.xLength / 4, this.data[i].top);
                    this.ctx.lineTo(this.data[i+1].left+ this.xLength / 4, this.data[i+1].top);
                }
                this.ctx.stroke();
            }else if(this.type === 'bar'){
                this.ctx.fillRect(
                    this.data[i].left, 
                    this.data[i].top, 
                    this.data[i].right - this.data[i].left, 
                    this.data[i].bottom - this.data[i].top
                );
            }

            this.ctx.font = '12px Arial'
            this.ctx.fillText(
                this.data[i].value * this.current / 100,
                this.data[i].left + this.xLength / 4, 
                this.data[i].top - 5
            );
        }
    },
    drawPieChart: function () {
        var x = this.width / 2,
            y = this.height / 2,
            x1 = 0,
            y1 = 0;
        for (var i = 0; i < this.dataLength; i++) {
            this.ctx.beginPath();
            this.ctx.fillStyle = this.colorList[i];
            this.ctx.moveTo(x, y);
            this.data[i].start = i === 0 ? -Math.PI / 2 : this.data[i - 1].end;
            this.data[i].end = this.data[i].start + this.data[i].value / this.totalValue * 2 * Math.PI;
            this.ctx.arc(x, y, this.radius, this.data[i].start, this.data[i].end);
            this.ctx.closePath();
            this.ctx.fill();

            this.data[i].middle = (this.data[i].start + this.data[i].end) / 2;
            x1 = Math.ceil(Math.abs(this.radius * Math.cos(this.data[i].middle)));
            y1 = Math.floor(Math.abs(this.radius * Math.sin(this.data[i].middle)));

            this.ctx.strokeStyle = this.colorList[i];
            if (this.data[i].middle <= 0) {
                this.ctx.textAlign = 'left';
                this.ctx.moveTo(x + x1, y - y1);
                this.ctx.lineTo(x + x1 + 10, y - y1 - 10);
                this.ctx.moveTo(x + x1 + 10, y - y1 - 10);
                this.ctx.lineTo(x + x1 + 40, y - y1 - 10);
                this.ctx.stroke();
                this.ctx.fillText(this.data[i].value, x + x1 + 45, y - y1 - 5);
            } else if (this.data[i].middle > 0 && this.data[i].middle <= Math.PI / 2) {
                this.ctx.textAlign = 'left';
                this.ctx.moveTo(x + x1, y + y1);
                this.ctx.lineTo(x + x1 + 10, y + y1 + 10);
                this.ctx.moveTo(x + x1 + 10, y + y1 + 10);
                this.ctx.lineTo(x + x1 + 40, y + y1 + 10);
                this.ctx.stroke();
                this.ctx.fillText(this.data[i].value, x + x1 + 45, y + y1 +15);
            } else if (this.data[i].middle > Math.PI / 2 && this.data[i].middle < Math.PI) {
                this.ctx.textAlign = 'right';
                this.ctx.moveTo(x - x1, y + y1);
                this.ctx.lineTo(x - x1 - 10, y + y1 + 10);
                this.ctx.moveTo(x - x1 - 10, y + y1 + 10);
                this.ctx.lineTo(x - x1 - 40, y + y1 + 10);
                this.ctx.stroke();
                this.ctx.fillText(this.data[i].value, x - x1 - 45, y + y1 +15);
            } else{
                this.ctx.textAlign = 'right';
                this.ctx.moveTo(x - x1, y - y1);
                this.ctx.lineTo(x - x1 - 10, y - y1 - 10);
                this.ctx.moveTo(x - x1 - 10, y - y1 - 10);
                this.ctx.lineTo(x - x1 - 40, y - y1 - 10);
                this.ctx.stroke();
                this.ctx.fillText(this.data[i].value, x - x1 - 45, y - y1 - 5);
            }
        }

        if(this.type === 'ring'){
            this.ctx.beginPath();
            this.ctx.fillStyle = this.bgColor;
            this.ctx.arc(x, y, this.innerRadius, 0, Math.PI*2);
            this.ctx.fill();
        }
    },
    drawAxis: function() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.axisColor;
        // y轴线, +0.5是为了解决canvas画1像素会显示成2像素的问题
		this.ctx.moveTo(this.padding + 0.5, this.height - this.padding + 0.5);
		this.ctx.lineTo(this.padding + 0.5, this.padding + 0.5);
		// x轴线
		this.ctx.moveTo(this.padding + 0.5, this.height - this.padding + 0.5);
		this.ctx.lineTo(this.width - this.padding / 2 + 0.5, this.height - this.padding + 0.5);
		this.ctx.stroke();
    },
    drawPoint: function() {
        // x轴坐标点
        this.ctx.beginPath();
        this.ctx.font = '12px Microsoft YaHei';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = this.axisColor; 
        for(var i = 0; i < this.dataLength; i ++){
			var name = this.data[i].name;
			var xlen = this.xLength * (i + 1);
			this.ctx.moveTo(this.padding + xlen + 0.5, this.height - this.padding + 0.5);
			this.ctx.lineTo(this.padding + xlen + 0.5, this.height - this.padding + 5.5);
			this.ctx.fillText(name, this.padding + xlen - this.xLength / 2, this.height - this.padding + 15);
		}
        this.ctx.stroke();

        // y轴坐标点
        this.ctx.beginPath();
        this.ctx.font = '12px Microsoft YaHei';
        this.ctx.textAlign = 'right';
        this.ctx.fillStyle = this.axisColor;
        this.ctx.moveTo(this.padding + 0.5, this.height - this.padding + 0.5);
        this.ctx.lineTo(this.padding - 4.5, this.height - this.padding + 0.5);
        this.ctx.fillText(0, this.padding - 10, this.height - this.padding + 5);
        for(var i=0; i < this.yEqual; i ++){
			var y = this.yFictitious * (i + 1);
			var ylen = this.yLength * (i + 1);
            this.ctx.beginPath();
            this.ctx.strokeStyle = this.axisColor;
			this.ctx.moveTo(this.padding + 0.5, this.height - this.padding - ylen + 0.5);
			this.ctx.lineTo(this.padding - 4.5, this.height - this.padding - ylen + 0.5);
			this.ctx.stroke();
			this.ctx.fillText(y,this.padding - 10, this.height - this.padding - ylen + 5);
            this.ctx.beginPath();
			this.ctx.strokeStyle = this.contentColor;
			this.ctx.moveTo(this.padding + 0.5, this.height - this.padding - ylen + 0.5)
			this.ctx.lineTo(this.width - this.padding / 2 + 0.5, this.height - this.padding - ylen+0.5);
            this.ctx.stroke();
		}
    },
    drawTitle: function() {
        if(this.title){
            this.ctx.beginPath();
			this.ctx.textAlign = 'center';
			this.ctx.fillStyle = this.titleColor;
			this.ctx.font = '16px Microsoft YaHei';
			if(this.titlePosition === 'bottom' && this.padding >= 40){
				this.ctx.fillText(this.title, this.width / 2, this.height - 5)
			}else{
				this.ctx.fillText(this.title, this.width / 2, this.padding / 2)
			}
		}
    },
    drawLegend: function () {
        for (var i = 0; i < this.dataLength; i++) {
            this.ctx.fillStyle = this.colorList[i];
            this.ctx.fillRect(10, this.legendTop + 20 * i, 20, 11);
            this.ctx.fillStyle = this.legendColor;
            this.ctx.font = '12px YaHei';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(this.data[i].name, 35, 50 + 20 * i);
        }
    },
    /**
     * y轴坐标点之间显示的间距
     * @param data 
     * @return y轴坐标间距
     */
    getYFictitious: function(data) {
        var arr = data.slice(0);
        arr.sort(function(a,b){
            return -(a.value-b.value);
        });
        var len = Math.ceil(arr[0].value / this.yEqual);
        var pow = len.toString().length - 1;
        pow = pow > 2 ? 2 : pow;
        return Math.ceil(len / Math.pow(10,pow)) * Math.pow(10,pow);
    },
    getTotalValue: function () {
        var total = 0;
        for (var i = 0; i < this.dataLength; i++) {
            total += this.data[i].value;
        }
        return total;
    }
}