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
})
