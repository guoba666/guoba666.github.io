---
title: 理解JS事件循环Event Loop
tags: [Javascript]
date: 2020-08-16 14:37:34 +0800
renderNumberedHeading: true
grammar_cjkRuby: true
---

# event loop的任务队列
javascript语言的特点是单线程，这意味着所有任务都必须排队执行，后面的任务必须等到前面的任务执行完毕才会执行，这样的方式使得加载速度大大降低，因此也就出现了同步任务和异步任务两种类别。**而event loop又分为主线程、宏队列（macrotask）和微队列（microtask）。**

**它们的运行机制如下：**
1. 所有的同步任务会在主线程顺序执行。
2. 遇到异步任务时会根据类别划分到宏队列或微队列中。
3. 主线程执行完毕。
4. 执行一次微队列中的任务直至完毕。
5. 执行一次宏队列中的任务直至完毕。
6. 继续循环依次执行第四步和第五步，直到任务队列全为空。
7. 主线程结束。

**其中的任务分类：  
宏队列：setTimeout、setInterval、setImmediate、I/O操作等；  
微队列：promise.then()、process.nextTick()；**  

#### 一个例子

	console.log('1');
	
	//把这个记为函数stFuncA
	setTimeout(function() {
		console.log('2');
		//把这个记为函数ntFuncB
		process.nextTick(function() {
			console.log('3');
		})
		//把这个记为P2
		new Promise(function(resolve) {
			console.log('4');
			resolve();
		}).then(function() {
			console.log('5')
		})
	})
	
	//把这个记为函数ntFuncA
	process.nextTick(function() {
		console.log('6');
	})
	//把这个记为P1
	new Promise(function(resolve) {
		console.log('7');
		resolve();
	}).then(function() {
		console.log('8')
	})
	
	//把这个记为函数stFuncB
	setTimeout(function() {
		console.log('9');
		//把这个记为函数ntFuncC
		process.nextTick(function() {
			console.log('10');
		})
		//把这个记为P3
		new Promise(function(resolve) {
			console.log('11');
			resolve();
		}).then(function() {
			console.log('12')
		})
	})
	
**这段代码的输出结果是1，7，6，8，2，4，9，11，3，10，5，12**

**执行过程如下。** 
### ①第一次循环
主线程：
1. 首先输出1，然后遇到函数stFuncA，把它放入宏队列（因为它是setTimeout函数）；
2. 然后遇到ntFuncA，放入微队列。
3. 遇到new Promise，立即执行回调函数中的代码，输出7，然后将then函数放入微队列。
4. 遇到stFuncB，放入宏队列。  
   **此时的任务队列：**  
	宏队列：stFuncA，stFuncB  
	微队列：ntFuncA，P1.then  
	**当前输出结果：1，7**  
5. 将微队列中的任务弹出到主线程的执行栈中执行。
6. 执行ntFuncA，输出6。
7. 执行P1.then，输出8。
8. 将宏队列中的任务弹出到主线程的执行栈中执行。
9. 执行stFuncA，输出2，然后将ntFuncB放入微队列，接着输出4，最后将P2.then放入微队列。
10. 执行stFuncB，输出9，然后将ntFuncC放入微队列，接着输出11，最后将P3.then放入微队列。  
    **此时的任务队列：**  
	宏队列：~~stFuncA，stFuncB~~（执行完毕）  
	微队列：~~ntFuncA，P1.then~~（执行完毕），ntFuncB，P2.then，ntFuncC，P3.then  
	**当前输出结果： #F44336==1，7，6，8，2，4，9，11**  
 

### ②第二次循环
主线程：
1. 将微队列中的任务弹出到主线程的执行栈中执行。（注意！这里很容易误以为微队列中的任务是顺序弹出的，但实际上由于微队列中存在nextTick函数，所以它的回调函数是在当前执行栈的尾部就执行，也就是说在第一次循环后，首先弹出的是微队列中的两个nextTick函数，即依次执行ntFuncB，ntFuncC，所以会输出3，10。） 
2. 执行P2.then，输出5。
3. 执行P3.then，输出12。
4. 主线程执行完毕，任务队列为空，程序结束。  
   **此时的任务队列：**  
	宏队列：~~stFuncA，stFuncB~~（执行完毕）  
	微队列：~~ntFuncA，P1.then~~（执行完毕），~~ntFuncB，P2.then，ntFuncC，P3.then~~（执行完毕）  
	**当前输出结果：1，7，6，8，2，4，9，11，3，10，5，11**  
