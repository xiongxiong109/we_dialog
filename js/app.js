$(function() {

	// doms
	var $startBtn = $("#startBtn");
	var $contentWrap = $(".content-wrap");

	// loadings
	var loadings = ['loading...', '加载中...', 'ready'];

	//questions
	var qs = [
		{
			field: 'ques1',
			arr: ["这是什么?", "不感兴趣"]			
		}
	];

	var curQ = 0; // 当前问题索引

	// dialogGame
	var dialogGame = {

		bootstrap: function() {

			var _this = this;
			// 点击后变形
			$startBtn.one('click', function() {

				$startBtn
				.css('position', 'relative')
				.addClass('pop-started')
				.animate({
					left: ($contentWrap.width() - $startBtn.width()) / 2 - 20
				}, 400, 'swing', function() {
					$startBtn.addClass('pop-readed');
					_this.init();
				});

			});

		},

		init: function() {

			var _this = this;

			// 给dom绑定事件
			_this.bindEvents();

			// 创建pop
			_this.createPop({

				msgs: loadings,
				delay: 800,
				type: 'pop-l',
				complete: function() {
					_this.loadQuestions(curQ);
				}

			});

		},

		loadQuestions: function(idx) {

			var _this = this;

			_this.createPop({
				msgs: qs[idx].arr,
				delay: 20,
				type: 'pop-r can-click', // 添加可点击的class
				dataField: qs[idx].field // 设置可点击元素的data字段 
			});

		},

		bindEvents: function() {

			// 绑定点击事件
			$contentWrap.delegate('.can-click', 'click', function() {

				var $target = $(this);
				var targetField = $target.data('field');
				var targetValue = $target.data('value');
				var $siblings = $target
														.parents('.dialog-box')
														.siblings('.dialog-box')
														.find('.' + targetField + '');

				$siblings.addClass('pop-readed');					

			});

		},

		createPop: function(options) {

			var settings = {
				msgs: '', // pop内容
				type: 'pop-block', // pop样式
				delay: 0, // 如果有连续的pop的话, delay属性可以指定连续pop的间隔时间, 如果不间隔时间为0, 则同时输出
				complete: null
			}

			// 扩展默认参数
			$.extend(settings, options || {});

			var msgs = settings.msgs;
			// 如果msgs参数是个数组, 则循环输出
			if (msgs instanceof Array) {

				var timer = null;
				var i = 0;

				timer = setInterval(function() {

					if (i >= msgs.length) {

						clearInterval(timer);
						// i = 0;
						settings.complete && settings.complete.call();

					} else {

						_create(msgs[i], i);
						i++;

					}

				}, settings.delay);

			} else { // 否则输出一次

				_create(msgs, settings.complete);

			}

			function _create(msg, args) {
				var $div = $(
					 '<div class="dialog-box">'
						+'<div class="pop ' + settings.type + ' animated zoomIn" style="display:none;">' + msg + '</div>'
					+'</div>');

				$div.appendTo($contentWrap);
				var $pop = $div.find('.pop');

				if ($pop.hasClass('can-click')) { // 如果$pop可点击
					if (typeof args === 'number') {

						$pop.data('field', settings.dataField); // 点击设置属性值
						$pop.data('value', args);
						$pop.addClass(settings.dataField);
					}
					
				}

				$pop.show();

				$("html, body")
				.stop()
				.animate({
					scrollTop: $div.offset().top + $div.height()
				}, settings.delay * 2, 'linear', function() {

					if (typeof args === 'function') {
						args && args();
					}
				});

			}

		}

	}

	dialogGame.bootstrap();

});