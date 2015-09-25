import Ember from 'ember';

export default Ember.Controller.extend({

  queryParams: ['systemId'],

  situationData: function() {
    return [{
      label: 'Juridische bedrijfsvorm',
      value: this.get('model.company.companyType')
    }, {
      label: 'Inkomen / winst',
      value: this.get('model.company.incomeCategory')
    }, {
      label: 'Huidig verbruik',
      value: this.get('model.company.energyUsage').toFixed(0) + ' kWh/jaar'
    }, {
      label: 'Netto energieprijs',
      value: '€ ' + this.get('model.company.energyPrice').toFixed(3) + ' per kWh'
    }, {
      label: 'Factor eigen verbruik',
      value: this.get('model.company.factorOwnUsage').toFixed(0) + '%'
    }, {
      label: 'Aansluiting',
      value: this.get('model.company.connection')
    }];
  }.property(),

  energyData: function() {
    const energyUsage = this.get('model.company.energyUsage');
    const energyPrice = this.get('model.company.energyPrice');
    const energyCost = energyUsage * energyPrice;

    let energyTax = 0.1196;
    if (energyUsage > 10000) {
      energyTax = 0.0469;
    }
    else if (energyUsage > 50000) {
      energyTax = 0.0125;
    }
    let totalEnergyTax = energyTax * energyUsage;

    return [{
      label: 'Netto energiekosten',
      value: '€ ' + (energyCost).toFixed(2)
    }, {
      label: 'Totale energiebelasting',
      value: '€ ' + totalEnergyTax.toFixed(2)
    }, {
      label: 'Totale energiekosten',
      value: '€ ' + (totalEnergyTax + energyCost).toFixed(2)
    }, {
      label: 'Energiebelasting',
      value: '€ ' + energyTax.toFixed(3)
    }, {
      label: 'Bruto energieprijs',
      value: '€ ' + ((totalEnergyTax + energyCost) / energyUsage).toFixed(3)
    }];
  }.property(),

  solarData: function() {
    const panelAmount = this.get('model.system.panelAmount');
    const panelPower = this.get('model.system.panelPower');
    const systemPower = panelAmount * panelPower;
    return [{
      label: 'Aantal te plaatsen panelen',
      value: panelAmount + ' stuks'
    }, {
      label: 'Vermogen per paneel',
      value: panelPower + ' Watt piek'
    }, {
      label: 'Totaal vermogen',
      value: systemPower + ' Watt piek'
    }];
  }.property(),
});
