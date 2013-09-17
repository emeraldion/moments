TARGET_NAME=Moments
MODERN_TARGET_NAME=Modern$(TARGET_NAME)
CLASSIC_TARGET_NAME=Classic$(TARGET_NAME)
RELEASE_DIR=release
VERSION=`defaults read "\`pwd\`/common/Info" CFBundleVersion`
# What a dirty trick...
VERSION_P=`defaults read "\`pwd\`/../common/Info" CFBundleVersion`

.PHONY: all release clean

all: release

install: release
	cp -fR $(RELEASE_DIR)/$(MODERN_TARGET_NAME).wdgt ~/Library/Widgets/
	cp -fR $(RELEASE_DIR)/$(CLASSIC_TARGET_NAME).wdgt ~/Library/Widgets/

release:
	mkdir -p $(RELEASE_DIR)/$(MODERN_TARGET_NAME).wdgt
	cp -R $(MODERN_TARGET_NAME).wdgt $(RELEASE_DIR)
	cp -fR common/* $(RELEASE_DIR)/$(MODERN_TARGET_NAME).wdgt
	mkdir -p $(RELEASE_DIR)/$(CLASSIC_TARGET_NAME).wdgt
	cp -R $(CLASSIC_TARGET_NAME).wdgt $(RELEASE_DIR)
	cp -fR common/* $(RELEASE_DIR)/$(CLASSIC_TARGET_NAME).wdgt
	find $(RELEASE_DIR) -name .svn -ls -exec rm -rf {} \; ; true
	cd $(RELEASE_DIR); zip -r $(MODERN_TARGET_NAME)-$(VERSION_P).zip $(MODERN_TARGET_NAME).wdgt
	cd $(RELEASE_DIR); zip -r $(CLASSIC_TARGET_NAME)-$(VERSION_P).zip $(CLASSIC_TARGET_NAME).wdgt
	#rm -rf $(RELEASE_DIR)/$(MODERN_TARGET_NAME).wdgt
	#rm -rf $(RELEASE_DIR)/$(CLASSIC_TARGET_NAME).wdgt

clean:
	rm -rf $(RELEASE_DIR)