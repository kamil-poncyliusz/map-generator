var timer = function(name) {
    var start = new Date();
    return {
        stop: function() {
            var end  = new Date();
            var time = end.getTime() - start.getTime();
            console.log('Timer:', name, 'finished in', time, 'ms');
        }
    }
};
function map(size, canvas, canvas_water) {
	this.size = size|0;
	this.canvas = document.getElementById(canvas);
	this.context = this.canvas.getContext('2d');
	this.hipsometric = new Uint8ClampedArray(size * size);
	this.count = [256];
	this.waterLevel = 0;
	this.generate = function(iterations) {
		var t = timer('Ganerate');
		var l = 1;
		for(var i=0;i<this.size;i++) {
			for(var j=0;j<this.size;j++) {
				this.hipsometric[j*this.size+i] = Math.random()*255|0;
			}
		}
		for(var i=2;i<=iterations;i++) {
			var ratio = Math.pow(2, i);
			var s = new Uint8ClampedArray(this.size/ratio * this.size/ratio);
			for(var j=0;j<this.size/ratio;j++) {
				for(var k=0;k<this.size/ratio;k++) {
					s[k*this.size/ratio+j] = Math.random()*255|0;
				}
			}
			var oldsize = this.size/ratio;
			for(var k=0;k<this.size;k++) {
				for(var j=0;j<this.size;j++) {
					var x0 = Math.floor(k/ratio), x1 = Math.ceil(k/ratio);
					var dx0 = k-x0*ratio;
					var y0 = Math.floor(j/ratio), y1 = Math.ceil(j/ratio);
					var dy0 = j-y0*ratio;
					if(x1 >= oldsize) {
						x1 = 0; var dx1 = oldsize*ratio-k;
					} else var dx1 = x1*ratio-k;
					if(y1 >= oldsize) {
						y1 = 0; var dy1 = oldsize*ratio-j;
					} else var dy1 = y1*ratio-j;
					var x0y0 = s[y0*oldsize+x0];
					var x0y1 = s[y1*oldsize+x0];
					var x1y0 = s[y0*oldsize+x1];
					var x1y1 = s[y1*oldsize+x1];
					var g, d, v;
					if(x0y0 === x1y0) g = x0y0;
					else g = (dx0 * x1y0 + dx1 * x0y0) / ratio;
					if(x0y1 === x1y1) d = x0y1;
					else d = (dx0 * x1y1 + dx1 * x0y1) / ratio;
					if(g === d) v = g;
					else v = ((g * dy1 + d * dy0) / ratio)|0;
					this.hipsometric[j*this.size+k] = ((this.hipsometric[j*this.size+k]*l+v*ratio)/(l+ratio))|0;
				}
			}
			l+=ratio;
		}
  		for(var i=0;i<256;i++) this.count[i] = 0;
  		for(var i=0;i<this.size*this.size;i++) this.count[this.hipsometric[i]]++;
  		t.stop();
	}
	this.drawHipsometric = function(hideWater) {
		var t = timer('View');
		var size = this.size;
		this.canvas.setAttribute('width', size);
		this.canvas.setAttribute('height', size);
		for(var y=0;y<size;y++) {
			for(var x=0;x<size;x++) {
				var value = 255 - this.hipsometric[y*size+x];
				this.context.fillStyle = 'rgba(' + value + ',' + value + ',' + value + ',' + 1 + ')';
				this.context.fillRect(x, y, 1, 1);
			}
		}
		if(!hideWater) {
			this.context.fillStyle = 'rgba(30, 150, 255, 0.3)';
			for(var y=0;y<this.size;y++) {
				for(var x=0;x<this.size;x++) {
					if(this.hipsometric[y*size+x] < this.waterLevel) {
						this.context.fillRect(x, y, 1, 1);
					}
				}
			}
		}
		t.stop();
	}
	this.setLandPercent = function(percent) {
		var percent = percent * this.size * this.size / 100;
		var sum = 0;
		var i=255;
		while(sum < percent) {
			sum += this.count[i];
			i--;
		}
		this.waterLevel = i;
	}
}