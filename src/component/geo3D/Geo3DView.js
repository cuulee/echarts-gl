var Geo3DBuilder = require('../common/Geo3DBuilder');
var echarts = require('echarts/lib/echarts');

var graphicGL = require('../../util/graphicGL');
var OrbitControl = require('../../util/OrbitControl');
var LightHelper = require('../common/LightHelper');

var retrieve = require('../../util/retrieve');

module.exports = echarts.extendComponentView({

    type: 'geo3D',

    __ecgl__: true,

    init: function (ecModel, api) {

        this._geo3DBuilder = new Geo3DBuilder();
        this.groupGL = new graphicGL.Node();

        this.groupGL.add(this._geo3DBuilder.rootNode);

        this._lightHelper = new LightHelper(this.groupGL);

        this._control = new OrbitControl({
            zr: api.getZr()
        });
        this._control.init();
    },

    render: function (geo3DModel, ecModel, api) {
        var geo3D = geo3DModel.coordinateSystem;

        if (!geo3D || !geo3D.viewGL) {
            return;
        }
        geo3D.viewGL.add(this.groupGL);
        console.profile('update');
        this._geo3DBuilder.update(geo3DModel);
        console.profileEnd('update');

        var control = this._control;
        control.setCamera(geo3D.viewGL.camera);

        var viewControlModel = geo3DModel.getModel('viewControl');
        control.setFromViewControlModel(viewControlModel, 0);

        this._lightHelper.updateLight(geo3DModel);
    },

    afterRender: function (geo3DModel, ecModel, api, layerGL) {
        var renderer = layerGL.renderer;
        this._lightHelper.updateAmbientCubemap(renderer, geo3DModel, api);
    }
});