/*页面连接跳转*/
import mobile from './mobile'
import goldlog from './goldlog'
var navigator = require('@ali/orbit-navigator');

module.exports = {
	init(){
		this.body = $('body');
		this.main = $('.main');
		this._bind();
	},
	_bind(){
		this.main.on('click', '[data-link]', $.proxy(this.loadUrl, this));
		// this.body.on('click', '[data-planetId]', $.proxy(this.loadPlanet, this));
		this.body.on('click','[data-planetId]',this.loadPlanet)
	},
	loadUrl(e){
		var target = $(e.currentTarget),
			parmas = target.data('link'),
			Arr = parmas.split(';'),
			md = target.data('md');

		goldlog('military',md,'CLK');

		if(Arr.length > 1){
			mobile.play({
				url:Arr[0],
				vid:Arr[1],
			})
		}else{
			mobile.openUrl({
				url:parmas
			})
		}
		return false;
	},
	loadPlanet(e){
		var target = $(e.currentTarget),
			h5detailurl = target.data('h5detailurl'),
			nativeschemaurl = target.data('nativeschemaurl'),
			md = target.data('md'),
			mdPage = target.data('mdpage') || 'military';
			
		goldlog(mdPage,md,'CLK');

		navigator.navigate({
			target : nativeschemaurl,
			fallback : h5detailurl,
			vi : '6.6.2.1',
			va : '6.6.3.3'
		});
		return false;
	}
}
