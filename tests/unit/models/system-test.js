import { moduleForModel, test } from 'ember-qunit';

moduleForModel('system', 'Unit | Model | system', {
  // Specify the other units that are required for this test.
  needs: ['model:customer', 'model:company']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
