﻿module BABYLON {
    export class InstancedMesh extends AbstractMesh {
        private _sourceMesh: Mesh;

        constructor(name: string, source: Mesh) {
            super(name, source.getScene());

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

        // Methods
        public get receiveShadows(): boolean {
            return this._sourceMesh.receiveShadows;
        }

        public get material(): Material {
            return this._sourceMesh.material;
        }

        public get visibility(): number {
            return this._sourceMesh.visibility;
        }

        public get skeleton(): Skeleton {
            return this._sourceMesh.skeleton;
        }

        public getTotalVertices(): number {
            return this._sourceMesh.getTotalVertices();
        }

        public get sourceMesh(): Mesh {
            return this._sourceMesh;
        }

        public getVerticesData(kind: string): number[] {
            return this._sourceMesh.getVerticesData(kind);
        }

        public isVerticesDataPresent(kind: string): boolean {
            return this._sourceMesh.isVerticesDataPresent(kind);
        }

        public getIndices(): number[] {
            return this._sourceMesh.getIndices();
        }

        public get _positions(): Vector3[] {
            return this._sourceMesh._positions;
        }

        public refreshBoundingInfo(): void {
            var data = this._sourceMesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);

            if (data) {
                var extend = BABYLON.Tools.ExtractMinAndMax(data, 0, this._sourceMesh.getTotalVertices());
                this._boundingInfo = new BABYLON.BoundingInfo(extend.minimum, extend.maximum);
            }

            this._updateBoundingInfo();
        }

        public _syncSubMeshes(): void {
            this.releaseSubMeshes();
            this.subMeshes = [];
            for (var index = 0; index < this._sourceMesh.subMeshes.length; index++) {
                this._sourceMesh.subMeshes[index].clone(this, this._sourceMesh);
            }
        }

        public _generatePointsArray(): boolean {
            return this._sourceMesh._generatePointsArray();
        }

        // Clone
        public clone(name: string, newParent: Node, doNotCloneChildren?: boolean): InstancedMesh {
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
                // Children
                for (var index = 0; index < this.getScene().meshes.length; index++) {
                    var mesh = this.getScene().meshes[index];

                    if (mesh.parent == this) {
                        mesh.clone(mesh.name, result);
                    }
                }
            }

            result.computeWorldMatrix(true);

            return result;
        }

        // Dispoe
        public dispose(doNotRecurse?: boolean): void {

            // Remove from mesh
            var index = this._sourceMesh.instances.indexOf(this);
            this._sourceMesh.instances.splice(index, 1);

            super.dispose(doNotRecurse);
        }
    }
} 