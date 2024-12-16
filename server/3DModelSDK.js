(function(global) {
    const ModelSDK = class {
        constructor() {
            this.config = {
                cdnBaseUrl: 'http://localhost:8888',
                modelViewerLibrary: 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js'
            };
            this.loadModelViewerLibrary();
        }

        loadModelViewerLibrary() {
            if (typeof document !== 'undefined' && !window.customElements.get('model-viewer')) {
                const script = document.createElement('script');
                script.src = this.config.modelViewerLibrary;
                script.type = 'module';
                document.head.appendChild(script);
            }
        }

        generateModelUrl(modelName) {
            return `http://localhost:8888/${modelName}`;
        }

        render(target, options = {}) {
            if (typeof document !== 'undefined') {
                const container = document.createElement('div');
                container.style.width = options.width || '100%';
                container.style.maxWidth = '100%';
                container.style.margin = 'auto';
                container.style.justifyItems = 'center';
                container.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
                container.style.borderRadius = '10px';
                
                const modelViewer = document.createElement('model-viewer');
                
                const modelUrl = this.generateModelUrl(options.modelName);

                if (!modelUrl) {
                    return null;
                }

                modelViewer.setAttribute('src', modelUrl);
                modelViewer.setAttribute('alt', options.modelName);
                modelViewer.setAttribute('camera-controls', options.cameraControls || 'true');
                modelViewer.setAttribute('auto-rotate', options.autoRotate || 'false');
                
                if (options.width) modelViewer.style.width = options.width;
                if (options.height) modelViewer.style.height = options.height;

                modelViewer.style.display = 'block';
                modelViewer.style.maxWidth = '100%';
                modelViewer.style.margin = 'auto';

                container.appendChild(modelViewer);

                if (typeof target === 'string') {
                    const targetElement = document.getElementById(target);
                    if (targetElement) {
                        targetElement.innerHTML = '';
                        targetElement.appendChild(container);
                    }
                } else if (target instanceof HTMLElement) {
                    target.innerHTML = '';
                    target.appendChild(container);
                }

                return modelViewer;
            } else if (typeof module !== 'undefined' && module.exports) {
                return this.generateModelUrl(options.modelId)      
            }
            return null;
        }

    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = ModelSDK;
    } else if (typeof define === 'function' && define.amd) {
        define([], function() { return ModelSDK; });
    } else {
        global.ModelSDK = ModelSDK;
    }

})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);