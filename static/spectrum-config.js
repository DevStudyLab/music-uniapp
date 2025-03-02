/**
 * 音频频谱可视化背景配置
 * 这个配置文件用于创建一个动态的音频频谱分析器背景
 * 与蓝色音乐主题相匹配
 */

const SpectrumConfig = {
  // 频谱配置
  bars: {
    count: 128, // 频谱条数量
    minHeight: 5, // 最小高度
    gap: 2, // 条之间的间隙
    roundedTops: true, // 是否使用圆角顶部
    baseColor: '#2979ff', // 基础颜色（与应用主题匹配）
    gradientColors: [
      { stop: 0, color: 'rgba(41, 121, 255, 0.8)' },
      { stop: 0.5, color: 'rgba(65, 105, 225, 0.6)' },
      { stop: 1, color: 'rgba(100, 149, 237, 0.4)' }
    ],
    // 频谱响应配置
    response: {
      sensitivity: 1.2, // 灵敏度
      maxHeight: 0.8, // 最大高度（相对于容器高度的比例）
      smoothingTimeConstant: 0.85, // 平滑系数
      fftSize: 256 // FFT大小，必须是2的幂
    }
  },
  // 粒子配置
  particles: {
    enabled: true, // 是否启用粒子
    count: 50, // 粒子数量
    colors: ['#2979ff', '#5094ff', '#78aeff'], // 粒子颜色
    minSize: 2, // 最小粒子大小
    maxSize: 5, // 最大粒子大小
    minSpeed: 0.5, // 最小速度
    maxSpeed: 1.5, // 最大速度
    fadeSpeed: 0.01 // 淡出速度
  },
  // 圆形波纹配置
  circleWaves: {
    enabled: true, // 是否启用圆形波纹
    count: 3, // 波纹数量
    color: 'rgba(41, 121, 255, 0.2)', // 波纹颜色
    minRadius: 50, // 最小半径
    maxRadius: 200, // 最大半径
    lineWidth: 2, // 线宽
    speed: 0.5 // 扩散速度
  },
  // 交互配置
  interaction: {
    enabled: true, // 是否启用交互
    type: 'ripple', // 交互类型：'ripple'（涟漪）或'attract'（吸引）
    strength: 5, // 交互强度
    decay: 0.95 // 效果衰减速度
  },
  // 背景配置
  background: {
    gradient: true, // 是否使用渐变背景
    colors: [
      { stop: 0, color: 'rgba(240, 248, 255, 0.2)' },
      { stop: 1, color: 'rgba(248, 248, 255, 0.1)' }
    ],
    angle: 180 // 渐变角度（度）
  }
};

/**
 * 初始化音频频谱可视化背景
 * @param {string} elementId - 容器元素ID
 * @returns {Object} - 控制对象
 */
function initAudioSpectrum(elementId) {
  const container = document.getElementById(elementId);
  if (!container) return null;
  
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
  
  // 创建音频分析器（模拟数据）
  let audioData = new Array(SpectrumConfig.bars.count).fill(0);
  let particles = [];
  let circleWaves = [];
  let mousePosition = { x: 0, y: 0 };
  let isMouseActive = false;
  
  // 初始化粒子
  if (SpectrumConfig.particles.enabled) {
    for (let i = 0; i < SpectrumConfig.particles.count; i++) {
      particles.push(createParticle());
    }
  }
  
  // 初始化圆形波纹
  if (SpectrumConfig.circleWaves.enabled) {
    for (let i = 0; i < SpectrumConfig.circleWaves.count; i++) {
      circleWaves.push({
        radius: SpectrumConfig.circleWaves.minRadius + Math.random() * 
                (SpectrumConfig.circleWaves.maxRadius - SpectrumConfig.circleWaves.minRadius),
        x: canvas.width / 2,
        y: canvas.height / 2,
        opacity: 1 - (i / SpectrumConfig.circleWaves.count)
      });
    }
  }
  
  // 鼠标交互
  if (SpectrumConfig.interaction.enabled) {
    container.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePosition.x = e.clientX - rect.left;
      mousePosition.y = e.clientY - rect.top;
      isMouseActive = true;
      
      // 如果是涟漪模式，添加新的圆形波纹
      if (SpectrumConfig.interaction.type === 'ripple') {
        circleWaves.push({
          radius: 0,
          x: mousePosition.x,
          y: mousePosition.y,
          opacity: 1
        });
        
        // 限制波纹数量
        if (circleWaves.length > SpectrumConfig.circleWaves.count + 5) {
          circleWaves.shift();
        }
      }
    });
    
    container.addEventListener('mouseleave', () => {
      isMouseActive = false;
    });
  }
  
  // 创建粒子函数
  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: SpectrumConfig.particles.minSize + Math.random() * 
            (SpectrumConfig.particles.maxSize - SpectrumConfig.particles.minSize),
      speedX: (Math.random() - 0.5) * (SpectrumConfig.particles.maxSpeed - SpectrumConfig.particles.minSpeed),
      speedY: (Math.random() - 0.5) * (SpectrumConfig.particles.maxSpeed - SpectrumConfig.particles.minSpeed),
      color: SpectrumConfig.particles.colors[Math.floor(Math.random() * SpectrumConfig.particles.colors.length)],
      opacity: 0.7 + Math.random() * 0.3
    };
  }
  
  // 生成模拟音频数据
  function generateAudioData() {
    for (let i = 0; i < audioData.length; i++) {
      // 创建一个波浪形状的频谱
      const baseValue = Math.sin(i * 0.15 + Date.now() * 0.001) * 0.5 + 0.5;
      // 添加一些随机性
      const randomValue = Math.random() * 0.2;
      // 结合基础值和随机值
      audioData[i] = baseValue * 0.8 + randomValue;
    }
  }
  
  // 绘制背景
  function drawBackground() {
    if (SpectrumConfig.background.gradient) {
      const gradient = ctx.createLinearGradient(
        0, 0,
        0, canvas.height
      );
      
      SpectrumConfig.background.colors.forEach(color => {
        gradient.addColorStop(color.stop, color.color);
      });
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }
  
  // 绘制频谱
  function drawSpectrum() {
    const barWidth = (canvas.width - (SpectrumConfig.bars.count - 1) * SpectrumConfig.bars.gap) / SpectrumConfig.bars.count;
    const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
    
    SpectrumConfig.bars.gradientColors.forEach(color => {
      gradient.addColorStop(color.stop, color.color);
    });
    
    ctx.fillStyle = gradient;
    
    for (let i = 0; i < SpectrumConfig.bars.count; i++) {
      const value = audioData[i];
      const barHeight = Math.max(
        value * canvas.height * SpectrumConfig.bars.response.maxHeight,
        SpectrumConfig.bars.minHeight
      );
      
      const x = i * (barWidth + SpectrumConfig.bars.gap);
      const y = canvas.height - barHeight;
      
      if (SpectrumConfig.bars.roundedTops) {
        // 绘制圆角顶部的频谱条
        ctx.beginPath();
        ctx.moveTo(x, canvas.height);
        ctx.lineTo(x, y + barWidth / 2);
        ctx.arc(x + barWidth / 2, y + barWidth / 2, barWidth / 2, Math.PI, 0, false);
        ctx.lineTo(x + barWidth, canvas.height);
        ctx.closePath();
        ctx.fill();
      } else {
        // 绘制矩形频谱条
        ctx.fillRect(x, y, barWidth, barHeight);
      }
    }
  }
  
  // 更新和绘制粒子
  function updateAndDrawParticles() {
    if (!SpectrumConfig.particles.enabled) return;
    
    ctx.save();
    
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      
      // 更新位置
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // 如果启用了交互并且是吸引模式
      if (SpectrumConfig.interaction.enabled && 
          SpectrumConfig.interaction.type === 'attract' && 
          isMouseActive) {
        const dx = mousePosition.x - particle.x;
        const dy = mousePosition.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = SpectrumConfig.interaction.strength / Math.max(distance, 10);
          particle.speedX += dx * force * 0.01;
          particle.speedY += dy * force * 0.01;
        }
      }
      
      // 边界检查
      if (particle.x < 0 || particle.x > canvas.width) {
        particle.speedX *= -1;
      }
      
      if (particle.y < 0 || particle.y > canvas.height) {
        particle.speedY *= -1;
      }
      
      // 限制速度
      const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
      if (speed > SpectrumConfig.particles.maxSpeed) {
        particle.speedX = (particle.speedX / speed) * SpectrumConfig.particles.maxSpeed;
        particle.speedY = (particle.speedY / speed) * SpectrumConfig.particles.maxSpeed;
      }
      
      // 绘制粒子
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }
  
  // 更新和绘制圆形波纹
  function updateAndDrawCircleWaves() {
    if (!SpectrumConfig.circleWaves.enabled && circleWaves.length === 0) return;
    
    ctx.save();
    ctx.strokeStyle = SpectrumConfig.circleWaves.color;
    ctx.lineWidth = SpectrumConfig.circleWaves.lineWidth;
    
    for (let i = circleWaves.length - 1; i >= 0; i--) {
      const wave = circleWaves[i];
      
      // 更新半径和不透明度
      wave.radius += SpectrumConfig.circleWaves.speed;
      wave.opacity -= 0.005;
      
      // 如果波纹消失，移除或重置它
      if (wave.opacity <= 0) {
        if (i < SpectrumConfig.circleWaves.count && !isMouseActive) {
          // 重置固定波纹
          wave.radius = SpectrumConfig.circleWaves.minRadius;
          wave.x = canvas.width / 2;
          wave.y = canvas.height / 2;
          wave.opacity = 1;
        } else {
          // 移除交互产生的额外波纹
          circleWaves.splice(i, 1);
          continue;
        }
      }
      
      // 绘制波纹
      ctx.globalAlpha = wave.opacity;
      ctx.beginPath();
      ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    ctx.restore();
  }
  
  // 动画循环
  function animate() {
    // 调整canvas大小以适应容器
    if (canvas.width !== container.offsetWidth || canvas.height !== container.offsetHeight) {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    }
    
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 生成新的音频数据
    generateAudioData();
    
    // 绘制背景
    drawBackground();
    
    // 绘制频谱
    drawSpectrum();
    
    // 更新和绘制粒子
    updateAndDrawParticles();
    
    // 更新和绘制圆形波纹
    updateAndDrawCircleWaves();
    
    // 继续动画循环
    requestAnimationFrame(animate);
  }
  
  // 开始动画
  animate();
  
  // 返回控制对象
  return {
    // 可以添加控制方法，例如暂停/恢复动画
    pause: () => {
      // 实现暂停逻辑
    },
    resume: () => {
      // 实现恢复逻辑
    },
    // 更新配置
    updateConfig: (newConfig) => {
      // 实现配置更新逻辑
    }
  };
}

export { SpectrumConfig, initAudioSpectrum };