class StickyNavigation {
  constructor() {
    this.currentId = null;
    this.currentTab = null;
    this.tabContainerHeight = 70;
    let self = this;

    $('.et-hero-tab').click(function(event) {
      event.preventDefault();
      let target = $(this.attr('href'));
      if(target.length){
        $('html, body').animate({
          scrollTop: target.offset().top - self.tabContainerHeight +1
        },600);
      }
    });

    $(window).scroll(()=>{ this.onScroll(); });
    $(window).resize(()=>{ this.onResize(); });
  }

  onScroll(){
    this.checkTabContainerPosition();
    this.findCurrentTabSelector();
  }

  onResize(){
    if(this.currentId) this.setSliderCss();
  }

  checkTabContainerPosition(){
    let offset = $('.et-hero-tabs').offset().top + $('.et-hero-tabs').height() - this.tabContainerHeight;
    if($(window).scrollTop() > offset){
      $('.et-hero-tabs-container').addClass('et-hero-tabs-container--top');
    } else {
      $('.et-hero-tabs-container').removeClass('et-hero-tabs-container--top');
    }
  }

  findCurrentTabSelector(){
    let newCurrentId=null, newCurrentTab=null, self=this;
    $('.et-hero-tab').each(function(){
      let id = $(this).attr('href');
      let section = $(id);
      if(section.length){
        let topOffset = section.offset().top - self.tabContainerHeight;
        let bottomOffset = topOffset + section.outerHeight();
        if($(window).scrollTop() > topOffset && $(window).scrollTop() < bottomOffset){
          newCurrentId = id;
          newCurrentTab = $(this);
        }
      }
    });
    if(this.currentId!==newCurrentId){
      this.currentId = newCurrentId;
      this.currentTab = newCurrentTab;
      this.setSliderCss();
    }
  }

  setSliderCss(){
    if(this.currentTab){
      let width = this.currentTab.outerWidth();
      let left = this.currentTab.offset().left;
      $('.et-hero-tab-slider').css({ width: width, left: left });
    }
  }
}

new StickyNavigation();
