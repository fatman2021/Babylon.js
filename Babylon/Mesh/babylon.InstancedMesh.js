﻿var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BABYLON;
(function (BABYLON) {
    var InstancedMesh = (function (_super) {
        __extends(InstancedMesh, _super);
        function InstancedMesh(name, source) {
            _super.call(this, name, source.getScene());

            source.instances.push(this);

            this._sourceMesh = source;

            this.position.copyFrom(source.position);
            this.rotation.copyFrom(source.rotation);
            this.scaling.copyFrom(source.scaling);

            if (source.rotationQuaternion) {
                this.rotationQuaternion.copyFrom(source.rotationQuaternion);
            }

            this.infiniteDistance = source.infiniteDistance;

            this.setPivotMatrix(source.getPivotMatrix());

            this.refreshBoundingInfo();
            this._syncSubMeshes();
        }
        Object.defineProperty(InstancedMesh.prototype, "receiveShadows", {
            // Methods
            get: function () {
                return this._sourceMesh.receiveShadows;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(InstancedMesh.prototype, "material", {
            get: function () {
                return this._sourceMesh.material;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(InstancedMesh.prototype, "visibility", {
            get: function () {
                return this._sourceMesh.visibility;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(InstancedMesh.prototype, "skeleton", {
            get: function () {
                return this._sourceMesh.skeleton;
            },
            enumerable: true,
            configurable: true
        });

        InstancedMesh.prototype.getTotalVertices = function () {
            return this._sourceMesh.getTotalVertices();
        };

        Object.defineProperty(InstancedMesh.prototype, "sourceMesh", {
            get: function () {
                return this._sourceMesh;
            },
            enumerable: true,
            configurable: true
        });

        InstancedMesh.prototype.getVerticesData = function (kind) {
            return this._sourceMesh.getVerticesData(kind);
        };

        InstancedMesh.prototype.isVerticesDataPresent = function (kind) {
            return this._sourceMesh.isVerticesDataPresent(kind);
        };

        InstancedMesh.prototype.getIndices = function () {
            return this._sourceMesh.getIndices();
        };

        Object.defineProperty(InstancedMesh.prototype, "_positions", {
            get: function () {
                return this._sourceMesh._positions;
            },
            enumerable: true,
            configurable: true
        });

        InstancedMesh.prototype.refreshBoundingInfo = function () {
            var data = this._sourceMesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);

            if (data) {
                var extend = BABYLON.Tools.ExtractMinAndMax(data, 0, this._sourceMesh.getTotalVertices());
                this._boundingInfo = new BABYLON.BoundingInfo(extend.minimum, extend.maximum);
            }

            this._updateBoundingInfo();
        };

        InstancedMesh.prototype._syncSubMeshes = function () {
            this.releaseSubMeshes();
            this.subMeshes = [];
            for (var index = 0; index < this._sourceMesh.subMeshes.length; index++) {
                this._sourceMesh.subMeshes[index].clone(this, this._sourceMesh);
            }
        };

        InstancedMesh.prototype._generatePointsArray = function () {
            return this._sourceMesh._generatePointsArray();
        };

        // Clone
        InstancedMesh.prototype.clone = function (name, newParent, doNotCloneChildren) {
            var result = this._sourceMesh.createInstance(name);

            // Deep copy
            BABYLON.Tools.DeepCopy(this, result, ["name"], []);

            // Bounding info
            this.refreshBoundingInfo();

            // Parent
            if (newParent) {
                result.parent = newParent;
            }

            if (!doNotCloneChildren) {
                for (var index = 0; index < this.getScene().meshes.length; index++) {
                    var mesh = this.getScene().meshes[index];

                    if (mesh.parent == this) {
                        mesh.clone(mesh.name, result);
                    }
                }
            }

            result.computeWorldMatrix(true);

            return result;
        };

        // Dispoe
        InstancedMesh.prototype.dispose = function (doNotRecurse) {
            // Remove from mesh
            var index = this._sourceMesh.instances.indexOf(this);
            this._sourceMesh.instances.splice(index, 1);

            _super.prototype.dispose.call(this, doNotRecurse);
        };
        return InstancedMesh;
    })(BABYLON.AbstractMesh);
    BABYLON.InstancedMesh = InstancedMesh;
})(BABYLON || (BABYLON = {}));
//# sourceMappingURL=babylon.InstancedMesh.js.map
