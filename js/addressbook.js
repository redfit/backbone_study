$(function(){
  // ===================================================
  // model class
  // ===================================================
  // Addressクラスを定義
  var Address = Backbone.Model.extend({
    // デフォルト値
    defaults: {
      name: ''
    },
    // 初期化
    initialize: function() {
      if (!this.get('name')) {
        this.set({name: this.defaults.name});
      }
    },
    // バリデーション
    validate: function(attributes){
      var name = attributes.name;
      if(!name || name === this.defaults.name){
        return 'Error!';
      }
    }
  });

  // ===================================================
  // collection class
  // ===================================================
  // AddressCollectionクラスを定義
  var AddressCollection = Backbone.Collection.extend({
    // コレクションで扱うモデル
    model: Address,
    // addressbook-sampleというキーでlocalStorageを使う
    localStorage: new Store('addressbook-sample')
  });
  // インスタンスの生成
  var Addresses = new AddressCollection;

  // ===================================================
  // view class
  // ===================================================
  // AddressViewクラスを定義
  var AddressView = Backbone.View.extend({
    tagName: 'li',
    className: 'address-item',
    // イベントハンドラの設定
    events: {
      'dblclick label.name': 'rename',
      'click button.delete': 'clear'
    },
    initialize: function(){
      // モデルへのバインド
      this.model.bind('change', this.render, this);
      this.model.bind('destroy', this.remove, this);
    },
    render: function(){
      $(this.el).html(
        $('<label class="name">').text(this.model.get('name'))
      ).append('<button class="delete">Delete</button>');
      return this;
    },
    rename: function(){
      var newName = window.prompt('Enter new name.', this.model.get('name'));
      this.model.save('name', newName);
    },
    clear: function(){
      this.model.destroy();
    }
  });

  // 一覧用View作成
  var AppView = Backbone.View.extend({
    el: $('#app'),
    events: {
      'keypress #new-address': 'keyPress',
      'click #delete-all': 'deleteAll'
    },
    initialize: function(){
      this.input = this.$('#new-address');
      // コレクションへのバインド
      Addresses.bind('add', this.add, this);
      Addresses.bind('reset', this.addAll, this);
      // モデル一覧取得
      Addresses.fetch();
    },
    add: function(address){
      // 引数のモデルからAddressViewを作成
      var view = new AddressView({model: address});
    },
    addAll: function(){
      Addresses.each(this.add);
    },
    keyPress: function(e){
      if(e.keyCode === 13){
        // Enterキーが押されたらモデルを追加する
        Addresses.create({name: this.input.val()});
      }
    },
    deleteAll: function(e){
      var address;
      while (address = Address.first()){
        address.destroy();
      }
    }
  });
  // インスタンス生成
  var App = new AppView;
})
