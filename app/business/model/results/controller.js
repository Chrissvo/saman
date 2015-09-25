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

  EIA: function() {
    const connection = this.get('model.company.connection');
    if (connection === "Aansluiting groter dan 3x80A") {
      return 0;
    }

    const panelPrice = this.get('model.system.panelPrice');
    const panelAmount = this.get('model.system.panelAmount');
    const panelPower = this.get('model.system.panelPower');
    const systemPower = panelAmount * panelPower;
    const brutoInvestment = panelPrice * systemPower;
    if (systemPower > 25000 && brutoInvestment > 2300) {
      return (brutoInvestment - 25000 * panelPrice) * 0.415;
    }
    return 0;
  }.property(),

  KIA: function() {
    const otherInvestments = this.get('model.company.otherInvestments');
    const panelPrice = this.get('model.system.panelPrice');
    const panelAmount = this.get('model.system.panelAmount');
    const panelPower = this.get('model.system.panelPower');
    const systemPower = panelAmount * panelPower;
    const brutoInvestment = panelPrice * systemPower;
    const totalInvestment = brutoInvestment + otherInvestments;

    if (totalInvestment <= 2300) {
      return 0;
    }
    else if (totalInvestment <= 55248) {
      return brutoInvestment * 0.28;
    }
    else if (totalInvestment <= 102311) {
      // other investments eat up the return
      if (otherInvestments > 15470) {
        return 0
      }
      else {
        return 15470 - otherInvestments;
      }
    }
    else if (totalInvestment <= 306931) {
      // other investments eat up the return
      if (otherInvestments > 15470 - 0.756 * totalInvestment) {
        return 0;
      }
      else {
        return 15470 - 0.756 * totalInvestment;
      }
    }
    return 0;
  }.property(),

  taxRate: function() {
    const incomeCategory = this.get('model.company.incomeCategory');
    let taxRate = 0;
    if (incomeCategory !== undefined) {
      switch (incomeCategory) {
        case '€ 0 - € 18.628':
          taxRate = 0.33;
          break;
        case '€ 18.628 - € 33.436':
          taxRate = 0.4195;
          break;
        case '€ 33.436 - € 55.694':
          taxRate = 0.42;
          break;
        case '€ 55.694 en hoger':
          taxRate = 0.52;
          break;
        case 'minder dan € 200.000':
          taxRate = 0.20;
          break;
        case 'meer dan € 200.000':
          taxRate = 0.25;
          break;
      }
    }
    return taxRate;
  }.property(),
});
