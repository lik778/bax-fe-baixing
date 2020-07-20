<template>
  <div class="city-selector-container">
    <el-dialog
      width="820px"
      z-index="2048"
      :show-close="false"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="city-selector-dialog"
    >
      <div slot="title" class="header">选择地域关键词</div>
      <div slot="default">
        <div class="selected-areas">
        <p class="placeholder">
          为保证效果建议选取15个地域关键词
          <span v-if="selectedAreas.length">（已选{{selectedAreas.length}}个）</span>
          <el-button
            size="mini"
            type="primary"
            @click="selectedAreas = []"
            v-if="selectedAreas.length"
          >
            删除全部
          </el-button>
        </p>
          <el-tag
            closable
            class="tag"
            size="small"
            :key="area.toString()"
            type="primary"
            v-for="area in selectedAreas"
            @close="deleteArea(area)"
          >
            {{area[area.length - 1]}}
          </el-tag>
        </div>
        <div class="active-areas">
          <span
            :key="index"
            v-for="(area, index) in activeAreas"
            @click="selectActiveArea(area)"
          >
            {{area === 'all' ? '全部' : area.name}}
            <i class="el-icon-loading" v-if="isLoadingAreasData && index + 1 === activeAreas.length"></i>
            <i class="el-icon-arrow-down" v-else></i>
          </span>
        </div>
        <div class="city-list">
          <div class="all">
            <h6 v-if="activeAreas.length === 1">全部省份</h6>
            <ul>
              <li :key="area.id" v-for="area in currentAreaList">
                <a
                  :class="{selected: area.isLeaf && isAreaSelected(area)}"
                  href="javascript:;"
                  @click="selectArea(area)"
                >
                  {{area.name}}
                  <span
                    class="hint"
                    v-show="!area.isLeaf && getAreaContainNum(area)"
                  >
                    {{getAreaContainNum(area)}}
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div slot="footer" class="footer">
        <el-button
          type="primary"
          size="small"
          class="left"
          v-if="
            typeof activeAreas[activeAreas.length - 1] === 'object' &&
            activeAreas[activeAreas.length - 1].children[0] &&
            activeAreas[activeAreas.length - 1].children[0].isLeaf"
          @click="selectAllAreas"
        >
          全选当前区域
        </el-button>
        <el-button size="small" @click="cancelSelectedCity">取消</el-button>
        <el-button size="small" type="primary" @click="confirmSelectedCity">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllCities,
  getAreasByCityId
} from '../../api/ka'
import clone from 'clone'
import isEqual from 'lodash.isequal'

const formatAreaOpts = function(data, isLeaf = false) {
  if (!Array.isArray(data)) return null

  return data.map(item => {
    return {
      ...item,
      isLeaf,
      value: item.name,
      children: formatAreaOpts(item.cities, false)
    }
  })
}

const loadAreasData = async function(areaId) {
  return formatAreaOpts(await getAreasByCityId(areaId), true)
}

const municipalities = ['北京', '上海', '天津', '重庆']
const defaultActiveAreas = ['all']

export default {
  name: 'areas-selector',
  data() {
    return {
      selectedAreas: [],

      isLoadingAreasData: false,

      activeAreas: clone(defaultActiveAreas),
      areaOpts: []
    }
  },
  props: {
    value: {
      type: Array,
      default: []
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    currentAreaList() {
      const {
        areaOpts,
        activeAreas
      } = this
      const activeArea = activeAreas[activeAreas.length - 1]
      return activeArea === 'all' ? areaOpts : activeArea.children
    }
  },
  methods: {
    selectAllAreas() {
      const { activeAreas, selectedAreas } = this
      const areaCommonPrefix = activeAreas.slice(1, activeAreas.length).map(area => area.name)
      const areas = activeAreas[activeAreas.length - 1].children.map(area => areaCommonPrefix.concat(area.name))
      this.selectedAreas = selectedAreas
        // 过滤掉当前区域已选的
        .filter(selected => !isEqual(selected.slice(0, -1), areaCommonPrefix))
        .concat(areas)
    },
    deleteArea(area) {
      this.selectedAreas = this.selectedAreas.filter(item => !isEqual(item, area))
    },
    selectActiveArea(area) {
      if (area === 'all') return this.activeAreas = clone(defaultActiveAreas)
      const { activeAreas }= this
      const areaIndex = activeAreas.indexOf(area)
      this.activeAreas.splice(areaIndex + 1, activeAreas.length)
    },
    async selectArea(area) {
      const {
        isAreaSelected,
        makeSelectedArea,
        isLoadingAreasData
      } = this

      if (isLoadingAreasData) return this.$message.warning('正在加载地域信息，请耐心等待')
      if (area.isLeaf) {
        const currentArea = makeSelectedArea(area)
        if (isAreaSelected(area)) {
          this.deleteArea(currentArea)
        } else {
          // selectedAreas [省，市，区] [直辖市，区]
          this.selectedAreas.push(currentArea)
        }
        return
      } else {
        // use cache
        if (!Array.isArray(area.children)) {
          this.isLoadingAreasData = true
          try {
            const specialArea = {
              isLeaf: true,
              value: area.name,
              name: `${area.name}`
            }
            area.children = [specialArea].concat(await loadAreasData(area.id))
          } finally {
            this.isLoadingAreasData = false
          }
        }
      }
      this.activeAreas.push(area)
    },
    confirmSelectedCity() {
      this.$emit('input', this.selectedAreas)
      this.closeModal()
    },
    cancelSelectedCity() {
      this.selectedAreas = clone(this.value)
      this.closeModal()
    },
    closeModal() {
      this.$emit('update:visible', false)
      this.activeAreas = clone(defaultActiveAreas)
    },
    makeSelectedArea(area) {
      const { activeAreas } = this
      return activeAreas.length === 3
        ? [activeAreas[1].value, activeAreas[2].value,  area.value]
        : [activeAreas[1].value, area.value]
    },
    isAreaSelected(area) {
      const {
        selectedAreas,
        makeSelectedArea
      } = this
      const currentArea = makeSelectedArea(area)
      return selectedAreas.some(item => isEqual(currentArea, item))
    },
    getAreaContainNum(area) {
      if (area.isLeaf) return 0
      const {
        activeAreas,
        selectedAreas
      } = this

      return selectedAreas
        .filter(item => item[activeAreas.length === 1 ? 0 : 1] === area.value)
        .length
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.selectedAreas = clone(val)
      }
    }
  },
  async created() {
    const allCities = await getAllCities()
    this.areaOpts = Object.freeze(formatAreaOpts(allCities))
  }
}
</script>



<style lang="postcss">
  .tag {
    margin-right: 6px;
    margin-bottom: 4px;
  }

  .city-selector-dialog {
    font-size: 14px;
    line-height: 1.5;
    padding: 20px;

    & .placeholder {
      font-size: 13px;
      margin-bottom: 6px;
      color: #888;
    }

    & .header {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 16px;
    }

    & .city-list {
      & h6 {
        font-size: 16px;
        margin: 20px 15px;
      }
      & ul {
        margin: 20px 25px;
        display: flex;
        flex-wrap: wrap;
      }
      & li {
        margin: 0 5px 5px;
        width: 120px;
        overflow: hidden;
        & > a {
          position: relative;
          padding: 6px 20px;
          color: #FF6350;
          border-radius: 2px;
          transition: .2s all;
          &.selected, &:hover {
            background-color: rgba(240, 110, 110, .9);
            color: #fff;
          }
        }
        & .hint {
          position: absolute;
          font-size: 12px;
          color: #fff;
          text-align: center;
          line-height: 14px;
          width: 14px;
          height: 14px;
          top: 4px;
          right: 4px;
          transform: scale(.85);
          background-color: #FF6350;
        }
      }
    }

    & .selected-areas {
      padding: 10px 20px;
      background-color: #fafafa;
    }

    & .active-areas {
      background-color: #fafafa;
      border-bottom: 1px solid #e6e6e6;
      padding: 0 30px;
      margin-bottom: 10px;
      display: flex;

      & > span {
        margin-right: 8px;
        cursor: pointer;
        border-width: 1px 1px 0;
        line-height: 29px;
        border-radius: 2px;
        border-color: #d9d9d9;
        border-style: solid;
        background-color: #fff;
        margin-bottom: -1px;
        display: inline-block;
        padding: 0 15px;
      }
    }


    & /deep/ .el-dialog__footer {
      & /deep/ .footer {
        display: flex;
      }
      & /deep/ .left {
        margin-left: 30px;
        margin-right: auto;
      }
    }

    & /deep/ .el-dialog__header,
    & /deep/ .el-dialog__body,
    & /deep/ .el-dialog__footer {
      padding: 0;
    }
  }

</style>
