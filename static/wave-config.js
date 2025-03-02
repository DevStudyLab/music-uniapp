/**
 * 音乐波形可视化背景配置
 * 这个配置文件用于创建一个动态的音乐波形背景
 * 与蓝色音乐主题相匹配
 */

const WaveConfig = {
  // 波形配置
  waves: [
    {
      // 第一层波形 - 主要波形
      color: 'rgba(41, 121, 255, 0.3)', // 蓝色，与应用主题匹配
      amplitude: 50, // 波形振幅
      frequency: 0.05, // 波形频率
      speed: 0.15 // 波形移动速度
    },
    {
      // 第二层波形 - 次要波形
      color: 'rgba(41, 121, 255, 0.2)',
      amplitude: 30,
      frequency: 0.08,
      speed: 0.1
    },
    {
      // 第三层波形 - 背景波形
      color: 'rgba(41, 121, 255, 0.1)',
      amplitude: 20,
      frequency: 0.1,
      speed: 0.05
    }
  ],
  // 音符配置
  notes: {
    enabled: true, // 是否启用音符
    count: 15, // 音符数量
    colors: ['#2979ff', '#5094ff', '#78aeff'], // 音符颜色
    minSize: 10, // 最小音符大小
    maxSize: 20, // 最大音符大小
    minSpeed: 1, // 最小上升速度
    maxSpeed: 3 // 最大上升速度
  },
  // 交互配置
  interaction: {
    enabled: true, // 是否启用交互
    rippleStrength: 5, // 涟漪强度
    rippleDecay: 0.95 // 涟漪衰减速度
  },
  // 响应音频配置
  audio: {
    enabled: false, // 默认不启用音频响应（可以在播放音乐时启用）
    sensitivity: 0.5, // 对音频的敏感度
    bassMultiplier: 2, // 低音增强倍数
    smoothing: 0.8 // 平滑系数
  }
};

/**
 * 初始化音乐波形背景
 * @param {string} elementId - 容器元素ID
 */
function initMusicWaves(elementId) {
  const container = document.getElementById(elementId);
  if (!container) return;
  
  // 创建canvas元素
  const canvas = document.createElement('canvas');
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '0';
  canvas.style.pointerEvents = 'none';
  container.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  const waves = WaveConfig.waves;
  const notes = [];
  
  // 初始化音符
  if (WaveConfig.notes.enabled) {
    for (let i = 0; i < WaveConfig.notes.count; i++) {
      notes.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 50,
        size: WaveConfig.notes.minSize + Math.random() * (WaveConfig.notes.maxSize - WaveConfig.notes.minSize),
        speed: WaveConfig.notes.minSpeed + Math.random() * (WaveConfig.notes.maxSpeed - WaveConfig.notes.minSpeed),
        color: WaveConfig.notes.colors[Math.floor(Math.random() * WaveConfig.notes.colors.length)],
        rotation: Math.random() * Math.PI * 2
      });
    }
  }
  
  // 鼠标交互
  let mouseX = 0;
  let mouseY = 0;
  let mouseActive = false;
  let ripples = [];
  
  if (WaveConfig.interaction.enabled) {
    container.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      mouseActive = true;
      
      // 添加涟漪效果
      ripples.push({
        x: mouseX,
        y: mouseY,
        radius: 0,
        maxRadius: 100,
        strength: WaveConfig.interaction.rippleStrength,
        decay: WaveConfig.interaction.rippleDecay
      });
    });
    
    container.addEventListener('mouseleave', () => {
      mouseActive = false;
    });
  }
  
  // 动画时间
  let time = 0;
  
  // 动画函数
  function animate() {
    // 调整canvas大小以适应容器
    if (canvas.width !== container.offsetWidth || canvas.height !== container.offsetHeight) {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    }
    
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制波形
    waves.forEach(wave => {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      
      for (let x = 0; x < canvas.width; x++) {
        // 基础波形
        let y = Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude;
        
        // 添加涟漪效果
        if (WaveConfig.interaction.enabled && mouseActive) {
          ripples.forEach(ripple => {
            const dx = x - ripple.x;
            const dy = (canvas.height / 2) - ripple.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 0 && distance < ripple.radius) {
              const effect = (1 - distance / ripple.radius) * ripple.strength;
              y += Math.sin(distance * 0.5 - time) * effect;
            }
          });
        }
        
        ctx.lineTo(x, canvas.height / 2 + y);
      }
      
      // 完成波形路径
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      
      // 填充波形
      ctx.fillStyle = wave.color;
      ctx.fill();
    });
    
    // 更新和绘制音符
    if (WaveConfig.notes.enabled) {
      ctx.save();
      for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        note.y -= note.speed;
        note.rotation += 0.01;
        
        // 如果音符超出屏幕顶部，重置到底部
        if (note.y < -note.size) {
          note.y = canvas.height + note.size;
          note.x = Math.random() * canvas.width;
        }
        
        // 绘制音符
        ctx.save();
        ctx.translate(note.x, note.y);
        ctx.rotate(note.rotation);
        ctx.fillStyle = note.color;
        
        // 绘制音符形状（简化的音符）
        ctx.beginPath();
        ctx.arc(0, 0, note.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(note.size / 2, 0);
        ctx.lineTo(note.size / 2, -note.size);
        ctx.lineWidth = 2;
        ctx.strokeStyle = note.color;
        ctx.stroke();
        
        ctx.restore();
      }
      ctx.restore();
    }
    
    // 更新涟漪
    if (WaveConfig.interaction.enabled) {
      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i];
        ripple.radius += 2;
        ripple.strength *= ripple.decay;
        
        if (ripple.strength < 0.1 || ripple.radius > ripple.maxRadius) {
          ripples.splice(i, 1);
        }
      }
    }
    
    // 更新时间
    time += 0.05;
    
    // 继续动画循环
    requestAnimationFrame(animate);
  }
  
  // 开始动画
  animate();
  
  // 返回控制对象
  return {
    setAudioEnabled: (enabled) => {
      WaveConfig.audio.enabled = enabled;
    },
    updateWithAudioData: (audioData) => {
      // 这里可以添加音频数据处理逻辑
      if (WaveConfig.audio.enabled && audioData) {
        // 根据音频数据调整波形
        // 这里是一个简化的示例
        const bassValue = audioData.bass * WaveConfig.audio.bassMultiplier * WaveConfig.audio.sensitivity;
        waves.forEach(wave => {
          wave.amplitude = wave.amplitude * (1 - WaveConfig.audio.smoothing) + 
                         bassValue * WaveConfig.audio.smoothing;
        });
      }
    }
  };
}

export { WaveConfig, initMusicWaves };