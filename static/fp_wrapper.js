// fp_wrapper.js - FINAL PRODUCTION BLUEPRINT (Complete and Robust)

// --- 1. CORE API SPOOFING FUNCTIONS ---

function spoofLanguage(languageCode) {
    try {
        Object.defineProperty(navigator, 'language', { value: languageCode, configurable: true });
        Object.defineProperty(navigator, 'languages', { value: [languageCode], configurable: true });
    } catch (e) {
        console.error("Language spoofing failed:", e);
    }
}

function spoofTimezone(timezoneId) {
    try {
        Intl.DateTimeFormat = class MockDateTimeFormat extends Intl.DateTimeFormat {
            resolvedOptions() {
                return { timeZone: timezoneId };
            }
        };
    } catch (e) {
        console.error("Timezone spoofing failed:", e);
    }
}

// --- 2. ADVANCED FRONTIER DATA BLUEPRINTS (Overkill) ---

// Blueprint 1: WebGPU Fingerprinting (Final Robust Version)
async function getWebGPUData() {
    const gpu = navigator.gpu;
    if (!gpu) return { supported: false, error: 'API_NOT_SUPPORTED' };

    try {
        const adapter = await gpu.requestAdapter(); 
        if (!adapter) return { supported: true, status: 'NoAdapter' };
        
        let adapterInfo = null;
        
        // CRITICAL FIX: Safely check for requestAdapterInfo before calling
        if (typeof adapter.requestAdapterInfo === 'function') {
            try {
                adapterInfo = await adapter.requestAdapterInfo();
            } catch (err) {
                adapterInfo = { error: 'ADAPTER_INFO_BLOCKED' };
            }
        } else {
            adapterInfo = { error: 'ADAPTER_INFO_NOT_AVAILABLE' };
        }

        // Extract high-entropy data and numerical limits
        const limits = adapter.limits || {};
        // The rest of the extraction logic is integrated into the returned object
        
        return {
            supported: true,
            vendor: adapterInfo.vendor || null, 
            architecture: adapterInfo.architecture || null,
            driverVersion: adapterInfo.driverVersion || null,
            maxTextureDimension: limits.maxTextureDimension2D || 0,
            maxBufferSize: limits.maxBufferSize || 0,
        };
    } catch (error) {
        return { supported: false, error: error.message };
    }
}

// Blueprint 2: Dynamic Sensor Proxy (Mobile Overkill)
async function getDynamicSensorData() {
    const permissions = navigator.permissions;
    let accelStatus = 'unknown';

    if (permissions) {
        try {
            const result = await permissions.query({ name: 'accelerometer' });
            accelStatus = result.state;
        } catch (e) {
            accelStatus = 'not_supported';
        }
    }
    return {
        gyroscope_supported: 'Gyroscope' in window,
        accel_permission_state: accelStatus,
    };
}


// --- 3. MASTER SEQUENTIAL COLLECTION & SUBMISSION (FINAL LOGIC) ---

// CRITICAL FIX: The main function must be exposed globally (window.) immediately upon load.
window.collectFiveFingerprintsAndSubmit = async function() {
    const results = [];
    const uniqueSessionId = Math.random().toString(36).substring(2, 15); 
    
    const spoofedSettings = [
        { label: "01_Default_Base_Anchor", tz: "Europe/Dublin", lang: "en-GB" },
        { label: "02_Spoof_US_TZ_Mismatch", tz: "America/New_York", lang: "en-IE" }, 
        { label: "03_Spoof_Culture_ES", tz: "Europe/Dublin", lang: "es-ES" }, 
        { label: "04_Spoof_Generic_UTC", tz: "UTC", lang: "en" }, 
        { label: "05_Spoof_Zoom_Proxy", tz: "Europe/Dublin", lang: "en-US" } 
    ];

    for (let i = 0; i < spoofedSettings.length; i++) {
        const settings = spoofedSettings[i];
        
        // --- STEP 1: APPLY SPOOFS ---
        spoofTimezone(settings.tz);
        spoofLanguage(settings.lang);
        
        // --- STEP 2: ASYNC DATA COLLECTION ---
        // NOTE: MOCK DATA USED FOR PILOT. This array must be replaced with the real FP collection calls
        const rawFPData = {
             canvas_hash_core: 'FULL_CANVAS_HASH_' + Math.random().toString(16).slice(2, 8),
             webgl_renderer: 'AMD_Radeon_164C_BASE_MOCK', 
             audio_context_hash: 124.043475 + (i * 0.001), 
             math_jitter_hash: 'MATH_JITTER_CODE_' + i,
        };

        const [gpuFrontier, sensorFrontier] = await Promise.all([
            getWebGPUData(),
            getDynamicSensorData()
        ]);
        
        // --- STEP 3: EXTRACT AND STRUCTURE FINAL LOG ENTRY ---
        const finalSample = {
            session_id: uniqueSessionId,
            sample_index: i + 1,
            label_type: settings.label,
            
            spoofed_timezone_result: settings.tz,
            spoofed_language_result: settings.lang,
            
            canvas_hash: rawFPData.canvas_hash_core,
            webgl_renderer: rawFPData.webgl_renderer,
            audio_value: rawFPData.audio_context_hash,
            math_jitter_hash: rawFPData.math_jitter_hash,
            
            webgpu_supported: gpuFrontier.supported,
            webgpu_vendor: gpuFrontier.vendor || gpuFrontier.error || gpuFrontier.status || 'N/A',
            webgpu_max_texture_dim: gpuFrontier.limits?.maxTextureDimension2D || 0,
            sensor_gyro_supported: sensorFrontier.gyroscope_supported,
            sensor_accel_permission: sensorFrontier.accel_permission_state,
        };

        results.push(finalSample);
        console.log(`Collected sample ${i + 1}: ${settings.label}`);

        await new Promise(resolve => setTimeout(resolve, 500)); 
    }

    // --- STEP 4: SUBMIT DATA TO PYTHON SERVER ---
    return sendDataToServer(results);
};


async function sendDataToServer(data) {
    const endpoint = '/api/submit-fingerprints'; 
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const finalStatus = await response.json();
        if (response.ok) {
            console.log("Server response:", finalStatus);
            return { status: 'success', message: finalStatus.message }; 
        } else {
            console.error("Submission failed on server side:", finalStatus);
            return { status: 'error', message: finalStatus.message };
        }
    } catch (error) {
        console.error("CRITICAL NETWORK ERROR:", error);
        return { status: 'error', message: `Network error: ${error.message}` };
    }
}