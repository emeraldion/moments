/**
 *	Moments Widget
 *
 *	© Claudio Procida 2005-2007
 *
 *	Disclaimer
 *
 *	The Moments Widget software (from now, the "Software") and the accompanying materials
 *	are provided “AS IS” without warranty of any kind. IN NO EVENT SHALL THE AUTHOR(S) BE
 *	LIABLE TO ANY PARTY FOR DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES,
 *	INCLUDING LOST PROFITS, ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN
 *	IF THE AUTHOR(S) HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. The entire risk as to
 *	the results and performance of this software is assumed by you. If the software is
 *	defective, you, and not the author, assume the entire cost of all necessary servicing,
 *	repairs and corrections. If you do not agree to these terms and conditions, you may not
 *	install or use this software.
 */

/**
 *	Photo object
 */

var PHOTO_DEFAULT_SIZE = 200;
var PHOTO_DEFAULT_SRC = "img/drag-here.png";
var PHOTO_LOADING_SRC = "img/loading.png";
var PHOTO_DUMMY_SRC = "img/null.gif";

function Photo()
{
	this.src = PHOTO_DEFAULT_SRC;
	this.size = PHOTO_DEFAULT_SIZE;
	this.width = PHOTO_DEFAULT_SIZE;
	this.height = PHOTO_DEFAULT_SIZE;

	this._dummy = document.getElementById("dummy");
	this.album = [];
}

Photo.prototype.init = function()
{
	var len = Preferences.preferenceForKey(PHOTO_ALBUM_LENGTH_KEY);
	// Read saved picture album
	this.album = new Array(len);
	for (var i = 0; i < len; i++)
	{
		this.album[i] = Preferences.preferenceForKey(PHOTO_ALBUM_ITEM_KEY.sprintf(i));
	}
	this.src = this.album[Preferences.preferenceForKey(PHOTO_ALBUM_INDEX_KEY)] || PHOTO_DEFAULT_SRC;
};

Photo.prototype.load = function()
{
	var photo = this;
	
	// Starts loading photo
	this._dummy.onload = function()
	{
		// The actual code that loads the picture
		// is triggered by the onload of _dummy
		this.onload = function()
		{
			photo.resize();
		};

		photo.size = Preferences.preferenceForKey(PHOTO_SIZE_KEY);
		photo.src = photo.album[Preferences.preferenceForKey(PHOTO_ALBUM_INDEX_KEY)] || PHOTO_DEFAULT_SRC;

		if (frame.glassVisible)
			showObj("glass");
		else
			hideObj("glass");
		this.src = photo.src;
	};
	// Set _dummy source
	this._dummy.src = PHOTO_LOADING_SRC;
};

Photo.prototype.clear = function()
{
	// Get current index
	var index = Preferences.preferenceForKey(PHOTO_ALBUM_INDEX_KEY);
	// Removes current photo
	this.album.splice(index, 1);
	
	if (this.album.length == 0)
	{
		this.size = this.width = this.height = PHOTO_DEFAULT_SIZE;
		this.src = PHOTO_DEFAULT_SRC;
	}
	else
	{
		this.src = this.album[0];
	}

	Preferences.setPreferenceForKey(limit3(index, 0, this.album.length - 1), PHOTO_ALBUM_INDEX_KEY);
	Preferences.setPreferenceForKey(this.album.length, PHOTO_ALBUM_LENGTH_KEY);
	for (var i = 0; i < this.album.length; i++)
	{
		Preferences.setPreferenceForKey(this.album[i], PHOTO_ALBUM_ITEM_KEY.sprintf(i));
	}

	this.load();
};

Photo.prototype.droppedPicture = function(src)
{
	this.album.unshift(src);
	
	Preferences.setPreferenceForKey(this.album.length, PHOTO_ALBUM_LENGTH_KEY);
	for (var i = 0; i < this.album.length; i++)
	{
		Preferences.setPreferenceForKey(this.album[i], PHOTO_ALBUM_ITEM_KEY.sprintf(i));
	}

	this.loadAlbumPhotoAtIndex(0);	
};

Photo.prototype.setAlbum = function(arr)
{
	this.album = arr;
	this.src = arr[0] || PHOTO_DEFAULT_SRC;
	
	Preferences.setPreferenceForKey(this.album.length, PHOTO_ALBUM_LENGTH_KEY);
	for (var i = 0; i < this.album.length; i++)
	{
		Preferences.setPreferenceForKey(this.album[i], PHOTO_ALBUM_ITEM_KEY.sprintf(i));
	}
	
	this.load();
}

Photo.prototype.loadAlbumPhotoAtIndex = function(idx)
{
	var src = this.album[idx];
	if (src)
	{
		this.src = src;
		Preferences.setPreferenceForKey(idx, PHOTO_ALBUM_INDEX_KEY)
		this.load();		
	}
}

Photo.prototype.increaseSize = function()
{
	var photoSizeSelector = getObj("prefFrm").elements["photo.size"];
	if (photoSizeSelector.selectedIndex < photoSizeSelector.options.length - 1)
	{
		photoSizeSelector.selectedIndex++;
		Preferences.setPreferenceForKey(photoSizeSelector.value, PHOTO_SIZE_KEY);
		this.load();
		return true;
	}
	return false;
};

Photo.prototype.decreaseSize = function()
{
	var photoSizeSelector = getObj("prefFrm").elements["photo.size"];
	if (photoSizeSelector.selectedIndex > 0)
	{
		photoSizeSelector.selectedIndex--;
		Preferences.setPreferenceForKey(photoSizeSelector.value, PHOTO_SIZE_KEY);
		this.load();
		return true;
	}
	return false;
};

Photo.prototype.resize = function()
{
	// called when image has been loaded
	scale = getScale(this._dummy.width, this._dummy.height);

	with (getObj("framecontent")) {
		style.width = px(this.width);
		style.height = px(this.height);
	}
	with (getObj("glass")) {
		style.height = px(Math.round(this.width / 400 * 95));
		style.width = px(this.width);
	}
	with (getObj("photo")) {
		src = PHOTO_DUMMY_SRC;
		style.width = px(this.width);
		style.height = px(this.height);
		onload = function()
		{
			frame.fitSizeToPhoto();
		};
		src = this.src;
	}
	this.width = Math.round(scale.width * this.size);
	this.height = Math.round(scale.height * this.size);
};

