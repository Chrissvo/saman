import Ember from 'ember';

export default Ember.Component.extend({

  actions: {
    submit: function() {
      const applicationController = this.container.lookup('controller:application');
      const fieldIds = this.childViews.getEach('fieldId');
      let data = {};
      for (var key in fieldIds) {
        const fieldId = fieldIds[key];
        const fieldObject = this.childViews.filterBy('fieldId', fieldId);
        const fieldValue = fieldObject.getEach('value')[0];
        const fieldRequired = fieldObject.getEach('isRequired')[0];
        const fieldLabel = fieldObject.getEach('label')[0];

        if (fieldRequired) {
          if (!fieldValue || fieldValue.length < 1) {
            //error
            return applicationController.notify({
              id: 'required.field.missing',
              message: 'Het invulveld "' + fieldLabel + '" is verplicht!',
              type: 'warning'
            });
          }
        }
        else if (fieldValue && fieldValue.length > 0) {
          data[fieldId] = fieldValue;
        }
      }
      if (Ember.$.isEmptyObject(data)) {
        //error
        return applicationController.notify({
          id: 'no.data',
          message: 'Er is geen data!',
          type: 'error'
        });
      }
      return this.sendAction('submit', data);
    }
  }
});
