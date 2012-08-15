// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {
	qrreader = require('com.acktie.mobile.ios.qr');
} else if (Ti.Platform.osname === 'android') {
	qrreader = require('com.acktie.mobile.android.qr');
}

// create tab group
var tabGroup = Titanium.UI.createTabGroup();

//
// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({
	title : 'Tab 1',
	backgroundColor : '#fff'
});
var tab1 = Titanium.UI.createTab({
	icon : 'KS_nav_views.png',
	title : 'Tab 1',
	window : win1
});

var scanQRButton = Titanium.UI.createButton({
	title : "Scan a QR Code",
});

scanQRButton.addEventListener('click', function() {
	var options = {
		// ** Android QR Reader properties (ignored by iOS)
		backgroundColor : 'black',
		width : '100%',
		height : '90%',
		top : 0,
		left : 0,
		// **

		// ** Used by iOS (allowZoom/userControlLight ignored on Android)
		userControlLight : true,
		allowZoom : false,

		// ** Used by both iOS and Android
		overlay : {
			imageName : 'exampleBranding.png',
		},
		continuous : true,
		success : success,
	};

	if (Ti.Platform.name == "android") {
		scanQRFromCamera(options);
	} else {
		qrreader.scanQRFromCamera(options);
	}
});

win1.add(scanQRButton);

//
// create controls tab and root window
//
var win2 = Titanium.UI.createWindow({
	title : 'Tab 2',
	backgroundColor : '#fff'
});
var tab2 = Titanium.UI.createTab({
	icon : 'KS_nav_ui.png',
	title : 'Tab 2',
	window : win2
});

var label2 = Titanium.UI.createLabel({
	color : '#999',
	text : 'I am Window 2',
	font : {
		fontSize : 20,
		fontFamily : 'Helvetica Neue'
	},
	textAlign : 'center',
	width : 'auto'
});

win2.add(label2);

//
//  add tabs
//
tabGroup.addTab(tab1);
tabGroup.addTab(tab2);

// open tab group
tabGroup.open();

function success(data) {
	Titanium.Media.vibrate();
	alert(data.data);
};

/*
 * Function that mimics the iPhone QR Code reader behavior.
 */
function scanQRFromCamera(options) {
	qrCodeWindow = Titanium.UI.createWindow({
		backgroundColor : 'black',
		width : '100%',
		height : '100%',
	});
	qrCodeView = qrreader.createQRCodeView(options);

	var closeButton = Titanium.UI.createButton({
		title : "close",
		bottom : 0,
		left : 0
	});
	var lightToggle = Ti.UI.createSwitch({
		value : false,
		bottom : 0,
		right : 0
	});

	closeButton.addEventListener('click', function() {
		qrCodeView.stop();
		qrCodeWindow.close();
	});

	lightToggle.addEventListener('change', function() {
		qrCodeView.toggleLight();
	})

	qrCodeWindow.add(qrCodeView);
	qrCodeWindow.add(closeButton);

	if (options.userControlLight != undefined && options.userControlLight) {
		qrCodeWindow.add(lightToggle);
	}

	// NOTE: Do not make the window Modal.  It screws stuff up.  Not sure why
	qrCodeWindow.open();
}