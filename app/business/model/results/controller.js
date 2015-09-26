import Ember from 'ember';

export default Ember.Controller.extend({

  queryParams: ['systemId'],

  // properties
  systemPower: function() {
    const panelAmount = this.get('model.system.panelAmount');
    const panelPower = this.get('model.system.panelPower');
    return panelAmount * panelPower;
  }.property(),

  energyProduction: function() {
    const systemPower = this.get('systemPower');
    const roofOrientationFactor = this.get('roofOrientationFactor');
    return systemPower * (roofOrientationFactor / 100) * 0.975;
  }.property(),
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

  investmentData: function() {
    const panelPrice = this.get('model.system.panelPrice');
    const panelAmount = this.get('model.system.panelAmount');
    const panelPower = this.get('model.system.panelPower');
    const systemPower = panelAmount * panelPower;
    const brutoInvestment = panelPrice * systemPower;
    const totalTax = this.get('EIA') + this.get('KIA') + brutoInvestment;
    const netInvestment = brutoInvestment - totalTax * this.get('taxRate');

    return [{
      label: 'Kosten per wp',
      value: '€ ' + panelPrice.toFixed(2)
    }, {
      label: 'Bruto investering',
      value: '€ ' + brutoInvestment.toFixed(2)
    }, {
      label: 'Netto fiscaal voordeel',
      value: '€ ' + totalTax.toFixed(2)
    }, {
      label: 'Netto investering',
      value: '€ ' + netInvestment.toFixed(2)
    }];
  }.property(),

  savingsData: function() {

  }.property(),

  sdeData: function() {

  }.property(),

  eiaData: function() {

  }.property(),

  kiaData: function() {

  }.property(),

  depreciationData: function() {

  }.property(),

  taxData: function() {

  }.property(),

  revenueData: function() {
    const panelAmount = this.get('model.system.panelAmount');
    const panelPower = this.get('model.system.panelPower');
    const systemPower = panelAmount * panelPower;
    const roofOrientation = this.get('model.system.roofOrientation');
    const roofSlope = this.get('model.system.roofSlope');
    let roofOrientationFactor = 87;
    switch (roofOrientation) {
      case 'O':
        switch (roofSlope) {
          case 0:
            roofOrientationFactor = 87;
            break;
          case 5:
            roofOrientationFactor = 89;
            break;
          case 10:
            roofOrientationFactor = 90;
            break;
          case 15:
            roofOrientationFactor = 89;
            break;
          case 20:
            roofOrientationFactor = 88;
            break;
          case 25:
            roofOrientationFactor = 87;
            break;
          case 30:
            roofOrientationFactor = 86;
            break;
          case 35:
            roofOrientationFactor = 85;
            break;
          case 40:
            roofOrientationFactor = 84;
            break;
          case 45:
            roofOrientationFactor = 82;
            break;
          case 50:
            roofOrientationFactor = 80;
            break;
          case 55:
            roofOrientationFactor = 78;
            break;
          case 60:
            roofOrientationFactor = 78;
            break;
          case 65:
            roofOrientationFactor = 73;
            break;
          case 70:
            roofOrientationFactor = 70;
            break;
          case 75:
            roofOrientationFactor = 68;
            break;
          case 80:
            roofOrientationFactor = 65;
            break;
          case 85:
            roofOrientationFactor = 62;
            break;
          case 90:
            roofOrientationFactor = 58;
            break;
        }
        break;
      case 'ZOO':
        switch (roofSlope) {
          case 0:
            roofOrientationFactor = 87;
            break;
          case 5:
            roofOrientationFactor = 91;
            break;
          case 10:
            roofOrientationFactor = 93;
            break;
          case 15:
            roofOrientationFactor = 93;
            break;
          case 20:
            roofOrientationFactor = 93;
            break;
          case 25:
            roofOrientationFactor = 93;
            break;
          case 30:
            roofOrientationFactor = 93;
            break;
          case 35:
            roofOrientationFactor = 92;
            break;
          case 40:
            roofOrientationFactor = 91;
            break;
          case 45:
            roofOrientationFactor = 89;
            break;
          case 50:
            roofOrientationFactor = 88;
            break;
          case 55:
            roofOrientationFactor = 86;
            break;
          case 60:
            roofOrientationFactor = 85;
            break;
          case 65:
            roofOrientationFactor = 82;
            break;
          case 70:
            roofOrientationFactor = 79;
            break;
          case 75:
            roofOrientationFactor = 76;
            break;
          case 80:
            roofOrientationFactor = 73;
            break;
          case 85:
            roofOrientationFactor = 68;
            break;
          case 90:
            roofOrientationFactor = 64;
            break;
        }
        break;
      case 'ZO':
        switch (roofSlope) {
          case 0:
            roofOrientationFactor = 87;
            break;
          case 5:
            roofOrientationFactor = 91;
            break;
          case 10:
            roofOrientationFactor = 93;
            break;
          case 15:
            roofOrientationFactor = 93;
            break;
          case 20:
            roofOrientationFactor = 93;
            break;
          case 25:
            roofOrientationFactor = 93;
            break;
          case 30:
            roofOrientationFactor = 93;
            break;
          case 35:
            roofOrientationFactor = 92;
            break;
          case 40:
            roofOrientationFactor = 91;
            break;
          case 45:
            roofOrientationFactor = 89;
            break;
          case 50:
            roofOrientationFactor = 88;
            break;
          case 55:
            roofOrientationFactor = 86;
            break;
          case 60:
            roofOrientationFactor = 85;
            break;
          case 65:
            roofOrientationFactor = 82;
            break;
          case 70:
            roofOrientationFactor = 79;
            break;
          case 75:
            roofOrientationFactor = 76;
            break;
          case 80:
            roofOrientationFactor = 73;
            break;
          case 85:
            roofOrientationFactor = 68;
            break;
          case 90:
            roofOrientationFactor = 64;
            break;
        }
        break;
      case 'ZZO':
        switch (roofSlope) {
          case 0:
            roofOrientationFactor = 87;
            break;
          case 5:
            roofOrientationFactor = 91;
            break;
          case 10:
            roofOrientationFactor = 95;
            break;
          case 15:
            roofOrientationFactor = 97;
            break;
          case 20:
            roofOrientationFactor = 98;
            break;
          case 25:
            roofOrientationFactor = 99;
            break;
          case 30:
            roofOrientationFactor = 100;
            break;
          case 35:
            roofOrientationFactor = 100;
            break;
          case 40:
            roofOrientationFactor = 99;
            break;
          case 45:
            roofOrientationFactor = 98;
            break;
          case 50:
            roofOrientationFactor = 97;
            break;
          case 55:
            roofOrientationFactor = 95;
            break;
          case 60:
            roofOrientationFactor = 93;
            break;
          case 65:
            roofOrientationFactor = 90;
            break;
          case 70:
            roofOrientationFactor = 87;
            break;
          case 75:
            roofOrientationFactor = 84;
            break;
          case 80:
            roofOrientationFactor = 80;
            break;
          case 85:
            roofOrientationFactor = 76;
            break;
          case 90:
            roofOrientationFactor = 71;
            break;
        }
        break;
      case 'Z':
        switch (roofSlope) {
          case 0:
            roofOrientationFactor = 87;
            break;
          case 5:
            roofOrientationFactor = 92;
            break;
          case 10:
            roofOrientationFactor = 96;
            break;
          case 15:
            roofOrientationFactor = 97;
            break;
          case 20:
            roofOrientationFactor = 98;
            break;
          case 25:
            roofOrientationFactor = 99;
            break;
          case 30:
            roofOrientationFactor = 100;
            break;
          case 35:
            roofOrientationFactor = 100;
            break;
          case 40:
            roofOrientationFactor = 100;
            break;
          case 45:
            roofOrientationFactor = 99;
            break;
          case 50:
            roofOrientationFactor = 97;
            break;
          case 55:
            roofOrientationFactor = 95;
            break;
          case 60:
            roofOrientationFactor = 93;
            break;
          case 65:
            roofOrientationFactor = 90;
            break;
          case 70:
            roofOrientationFactor = 87;
            break;
          case 75:
            roofOrientationFactor = 84;
            break;
          case 80:
            roofOrientationFactor = 80;
            break;
          case 85:
            roofOrientationFactor = 76;
            break;
          case 90:
            roofOrientationFactor = 71;
            break;
        }
        break;
      case 'ZZW':
        switch (roofSlope) {
          case 0:
            roofOrientationFactor = 87;
            break;
          case 5:
            roofOrientationFactor = 91;
            break;
          case 10:
            roofOrientationFactor = 95;
            break;
          case 15:
            roofOrientationFactor = 97;
            break;
          case 20:
            roofOrientationFactor = 98;
            break;
          case 25:
            roofOrientationFactor = 98;
            break;
          case 30:
            roofOrientationFactor = 98;
            break;
          case 35:
            roofOrientationFactor = 98;
            break;
          case 40:
            roofOrientationFactor = 98;
            break;
          case 45:
            roofOrientationFactor = 97;
            break;
          case 50:
            roofOrientationFactor = 95;
            break;
          case 55:
            roofOrientationFactor = 93;
            break;
          case 60:
            roofOrientationFactor = 90;
            break;
          case 65:
            roofOrientationFactor = 88;
            break;
          case 70:
            roofOrientationFactor = 85;
            break;
          case 75:
            roofOrientationFactor = 82;
            break;
          case 80:
            roofOrientationFactor = 78;
            break;
          case 85:
            roofOrientationFactor = 74;
            break;
          case 90:
            roofOrientationFactor = 70;
        }
        break;
      case 'ZW':
        switch (roofSlope) {
          case 0:
            roofOrientationFactor = 87;
            break;
          case 5:
            roofOrientationFactor = 91;
            break;
          case 10:
            roofOrientationFactor = 94;
            break;
          case 15:
            roofOrientationFactor = 95;
            break;
          case 20:
            roofOrientationFactor = 96;
            break;
          case 25:
            roofOrientationFactor = 96;
            break;
          case 30:
            roofOrientationFactor = 96;
            break;
          case 35:
            roofOrientationFactor = 96;
            break;
          case 40:
            roofOrientationFactor = 95;
            break;
          case 45:
            roofOrientationFactor = 94;
            break;
          case 50:
            roofOrientationFactor = 92;
            break;
          case 55:
            roofOrientationFactor = 90;
            break;
          case 60:
            roofOrientationFactor = 87;
            break;
          case 65:
            roofOrientationFactor = 85;
            break;
          case 70:
            roofOrientationFactor = 82;
            break;
          case 75:
            roofOrientationFactor = 79;
            break;
          case 80:
            roofOrientationFactor = 75;
            break;
          case 85:
            roofOrientationFactor = 71;
            break;
          case 90:
            roofOrientationFactor = 67;
            break;
        }
        break;
      case 'ZWW':
        switch (roofSlope) {
          case 0:
            roofOrientationFactor = 87;
            break;
          case 5:
            roofOrientationFactor = 89;
            break;
          case 10:
            roofOrientationFactor = 91;
            break;
          case 15:
            roofOrientationFactor = 92;
            break;
          case 20:
            roofOrientationFactor = 91;
            break;
          case 25:
            roofOrientationFactor = 91;
            break;
          case 30:
            roofOrientationFactor = 90;
            break;
          case 35:
            roofOrientationFactor = 89;
            break;
          case 40:
            roofOrientationFactor = 87;
            break;
          case 45:
            roofOrientationFactor = 86;
            break;
          case 50:
            roofOrientationFactor = 85;
            break;
          case 55:
            roofOrientationFactor = 83;
            break;
          case 60:
            roofOrientationFactor = 81;
            break;
          case 65:
            roofOrientationFactor = 78;
            break;
          case 70:
            roofOrientationFactor = 75;
            break;
          case 75:
            roofOrientationFactor = 72;
            break;
          case 80:
            roofOrientationFactor = 69;
            break;
          case 85:
            roofOrientationFactor = 65;
            break;
          case 90:
            roofOrientationFactor = 61;
            break;
        }
        break;
      case 'W':
        switch (roofSlope) {
          case 0:
            roofOrientationFactor = 87;
            break;
          case 5:
            roofOrientationFactor = 88;
            break;
          case 10:
            roofOrientationFactor = 89;
            break;
          case 15:
            roofOrientationFactor = 88;
            break;
          case 20:
            roofOrientationFactor = 87;
            break;
          case 25:
            roofOrientationFactor = 87;
            break;
          case 30:
            roofOrientationFactor = 86;
            break;
          case 35:
            roofOrientationFactor = 84;
            break;
          case 40:
            roofOrientationFactor = 82;
            break;
          case 45:
            roofOrientationFactor = 80;
            break;
          case 50:
            roofOrientationFactor = 78;
            break;
          case 55:
            roofOrientationFactor = 76;
            break;
          case 60:
            roofOrientationFactor = 74;
            break;
          case 65:
            roofOrientationFactor = 72;
            break;
          case 70:
            roofOrientationFactor = 69;
            break;
          case 75:
            roofOrientationFactor = 66;
            break;
          case 80:
            roofOrientationFactor = 63;
            break;
          case 85:
            roofOrientationFactor = 60;
            break;
          case 90:
            roofOrientationFactor = 57;
            break;
        }
        break;
    }
    const energyProduction = (systemPower * (roofOrientationFactor / 100) * 0.975).toFixed(0);
    return [{
      label: 'Orientatie',
      value: roofOrientation
    }, {
      label: 'Hellingshoek',
      value: roofSlope
    }, {
      label: 'Orientatiefactor',
      value: roofOrientationFactor + '%'
    }, {
      label: 'Elektriciteitsproductie',
      value: energyProduction + ' kWh/jaar'
    }];
  }.property()

});
